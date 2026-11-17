import { supabase } from '../lib/supabase.js';

const LOCAL_STORAGE_KEY = 'campus_events_registrations_v1';

/**
 * Common engineering department aliases for flexible matching
 */
const BRANCH_ALIASES = {
  cse: ['cse', 'cs', 'computer science', 'computer science & engineering'],
  aiml: ['aiml', 'cse (ai & ml)', 'ai & ml', 'ai/ml', 'cse (ai & machine learning)', 'artificial intelligence'],
  ds: ['ds', 'cse (data science)', 'data science'],
  iot: ['iot', 'cse (iot)', 'internet of things'],
  ece: ['ece', 'electronics', 'electronics & communication'],
  ise: ['ise', 'is', 'information science', 'information science & engineering'],
  mech: ['mech', 'mechanical', 'mechanical engineering'],
  civil: ['civil', 'civil engineering']
};

/**
 * Checks whether the student's branch is allowed for that event using allowed_branches.
 */
export function checkBranchEligibility(event, studentBranch) {
  if (!event) {
    return { eligible: false, message: 'Event information unavailable.' };
  }
  if (!studentBranch || !studentBranch.trim()) {
    return { eligible: false, message: 'Please select an engineering department.' };
  }

  // Read allowed_branches from event (support snake_case, camelCase, branch_ids, or tags)
  const rawAllowed =
    event.allowed_branches ||
    event.allowedBranches ||
    event.branchIds ||
    event.branch_ids ||
    event.tags;

  if (!rawAllowed || (Array.isArray(rawAllowed) && rawAllowed.length === 0)) {
    return { eligible: true, allowedBranches: ['All Branches'], message: 'Open to all departments.' };
  }

  let list = [];
  if (Array.isArray(rawAllowed)) {
    list = rawAllowed;
  } else if (typeof rawAllowed === 'string') {
    list = rawAllowed.split(',').map((s) => s.trim()).filter(Boolean);
  }

  // Check wildcard / all
  if (list.some((item) => String(item).toUpperCase() === 'ALL' || String(item) === '*')) {
    return { eligible: true, allowedBranches: ['All Branches'], message: 'Open to all departments.' };
  }

  const normalizedStudent = studentBranch.trim().toLowerCase();

  // Find candidate keys for student's branch
  const candidateKeys = Object.entries(BRANCH_ALIASES)
    .filter(([key, aliases]) => key === normalizedStudent || aliases.some((a) => normalizedStudent.includes(a) || a.includes(normalizedStudent)))
    .map(([key]) => key);

  if (candidateKeys.length === 0) {
    candidateKeys.push(normalizedStudent);
  }

  const isEligible = list.some((allowedItem) => {
    const normAllowed = String(allowedItem).trim().toLowerCase();
    if (normAllowed === 'all' || normAllowed === '*') return true;
    return candidateKeys.some((k) => {
      const aliases = BRANCH_ALIASES[k] || [k];
      return normAllowed === k || aliases.some((a) => normAllowed.includes(a) || a.includes(normAllowed));
    });
  });

  return {
    eligible: isEligible,
    allowedBranches: list,
    message: isEligible
      ? `Eligible: ${studentBranch} is an approved department for this event.`
      : `Registration Ineligible: The ${studentBranch} department is not permitted for "${event.title}". Restricted to: ${list.join(', ')}.`
  };
}

/**
 * Validates registration form fields:
 * Full Name, USN, Branch, and College Email are all required.
 */
export function validateRegistrationForm({ fullName, usn, branch, email, event }) {
  const errors = {};

  if (!fullName || !fullName.trim()) {
    errors.fullName = 'Full Name is required.';
  }

  if (!usn || !usn.trim()) {
    errors.usn = 'USN is required.';
  } else if (usn.trim().length < 5) {
    errors.usn = 'Please enter a valid USN (e.g., 1MS22CS045).';
  }

  if (!branch || !branch.trim()) {
    errors.branch = 'Department / Branch is required.';
  }

  if (!email || !email.trim()) {
    errors.email = 'College email is required.';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
  }

  // Branch eligibility check using allowed_branches
  if (branch && event) {
    const branchCheck = checkBranchEligibility(event, branch);
    if (!branchCheck.eligible) {
      errors.branch = branchCheck.message;
    }
  }

  const isValid = Object.keys(errors).length === 0;
  return {
    isValid,
    errors,
    errorMessage: !isValid ? Object.values(errors)[0] : null
  };
}

/**
 * Checks whether a registration for the same event and USN already exists locally.
 * Enforces case-insensitive USN matching matching the database unique constraint on (event_id, lower(usn)).
 * Database-level duplicates are caught directly upon insert via PostgreSQL code 23505 without calling RPC.
 */
export function checkDuplicateRegistration(eventId, usn) {
  if (!eventId || !usn) return { isDuplicate: false };

  const normalizedUsnLower = usn.trim().toLowerCase();
  const normalizedEventId = String(eventId);

  // Client-side storage check for instant feedback on the same browser/device
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const records = JSON.parse(raw);
      if (Array.isArray(records)) {
        const match = records.find(
          (r) => String(r.eventId) === normalizedEventId && String(r.usn).toLowerCase() === normalizedUsnLower
        );
        if (match) {
          return {
            isDuplicate: true,
            message: `Duplicate Registration: A registration for USN ${usn.trim().toUpperCase()} already exists for this event on this device.`
          };
        }
      }
    }
  } catch {
    // Ignore localStorage parse errors
  }

  return { isDuplicate: false };
}

/**
 * Saves successful registration to local tracking
 */
export function recordLocalRegistration(eventId, usn, passId) {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    const records = raw ? JSON.parse(raw) : [];
    records.push({
      eventId: String(eventId),
      usn: usn.trim().toUpperCase(),
      passId,
      timestamp: Date.now()
    });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
  } catch {
    // ignore
  }
}

/**
 * Submits registration to Supabase public.registrations table securely.
 * Note: Does NOT chain .select() to preserve student privacy under RLS where SELECT is restricted to anon.
 */
export async function submitRegistration({
  event,
  fullName,
  usn,
  branch,
  email,
  phone = '',
  selectedYear = 2
}) {
  // 1. Form validation
  const validation = validateRegistrationForm({ fullName, usn, branch, email, event });
  if (!validation.isValid) {
    throw new Error(validation.errorMessage || 'Please fill all required fields correctly.');
  }

  const normalizedEventId = String(event.id || event.event_id);
  const normalizedUsn = usn.trim().toUpperCase();
  const normalizedFullName = fullName.trim();
  const normalizedBranch = branch.trim();
  const normalizedEmail = email.trim().toLowerCase();

  // 2. Local duplicate check
  const dupCheck = checkDuplicateRegistration(normalizedEventId, normalizedUsn);
  if (dupCheck.isDuplicate) {
    const dupErr = new Error(dupCheck.message);
    dupErr.code = '23505';
    throw dupErr;
  }

  // 3. Prepare payload for Supabase public.registrations matching database schema
  const payload = {
    event_id: normalizedEventId,
    full_name: normalizedFullName,
    usn: normalizedUsn,
    branch: normalizedBranch,
    college_email: normalizedEmail
  };

  // 4. Submit to Supabase
  // Secure submission: Insert without .select() so anon doesn't require SELECT permission
  const { error, status, statusText } = await supabase
    .from('registrations')
    .insert([payload]);

  if (error) {
    // Check for PostgreSQL unique constraint violation on (event_id, lower(usn))
    if (
      error.code === '23505' ||
      (error.message || '').toLowerCase().includes('unique') ||
      (error.message || '').toLowerCase().includes('duplicate')
    ) {
      const duplicateError = new Error(
        `Duplicate registration: A registration with USN "${normalizedUsn}" already exists for this event.`
      );
      duplicateError.code = '23505';
      duplicateError.status = 409;
      throw duplicateError;
    }

    // Permission check failure
    if (error.code === '42501' || (error.message || '').toLowerCase().includes('permission denied')) {
      const permissionError = new Error(
        `Database permission required: Supabase table 'public.registrations' requires INSERT permission for anon.`
      );
      permissionError.code = '42501';
      permissionError.hint = error.hint;
      permissionError.status = status;
      permissionError.statusText = statusText;
      throw permissionError;
    }

    const genericError = new Error(error.message || 'Failed to submit registration to database.');
    genericError.code = error.code;
    genericError.status = status;
    throw genericError;
  }

  // 5. Generate pass data
  const yearSuffix = selectedYear === 1 ? '1st' : selectedYear === 2 ? '2nd' : selectedYear === 3 ? '3rd' : '4th';
  const passId = `#EVT-2025-${Math.floor(1000 + Math.random() * 9000)}`;

  const passData = {
    passId,
    fullName: normalizedFullName,
    usn: normalizedUsn,
    branch: normalizedBranch,
    year: `${yearSuffix} Year`,
    email: normalizedEmail,
    phone: phone ? phone.trim() : '+91 98765 43210',
    eventTitle: event.title,
    eventDate: `${event.date} • ${event.time}`,
    venue: event.venue,
    timestamp: new Date().toISOString()
  };

  // Record locally for duplicate detection
  recordLocalRegistration(normalizedEventId, normalizedUsn, passId);

  return {
    success: true,
    passData,
    message: `Registration confirmed for ${normalizedFullName} (${normalizedUsn})!`
  };
}
