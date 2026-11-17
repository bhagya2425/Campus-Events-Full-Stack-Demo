import { supabase } from '../lib/supabase.js';
import { EVENTS_DATA } from '../data/eventsData.js';

/**
 * Normalizes a row from Supabase public.events table into the frontend event schema.
 * Handles both snake_case and camelCase database columns gracefully.
 */
export function normalizeEvent(row) {
  if (!row) return null;

  const category = (row.category || '').toLowerCase().includes('non')
    ? 'non-tech'
    : (row.category || '').toLowerCase() === 'tech'
      ? 'tech'
      : (row.track || '').toLowerCase().includes('cultural')
        ? 'non-tech'
        : 'tech';

  const defaultImage = category === 'tech'
    ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAveIRqsR_LZyRvVR8CrgGU-P0q9seF_dQaWJXiHZVfJkq4dACnWYO3yPtShk0elv0YxYjrDBw6bqlHBA-Gm1c-KaMUMntYjaDFjdCtMDvOKuA2ha-2S-TT80sSfnhgYLZX_aVwkr8vGsDuvuHC1SgRz7mArkuMo04MZRhj17odTyE-IdsMQ6duxXp8KVqHzfQmdVx2zPjL1D-fW6I50OuBapTjZWLSaMRpWpWSMF9c'
    : 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKNJT0SvLatCVG54mZJvfogag7sYmdCr1ChupS-1BV4jJjo_hhPMQTx9dh74BzLU7MDC-_qr2ua38ldv8FaC3k5DeEBv-NZK6QfZknPMbwI47KkUaCNZNfka9ubTViqKKFuW7k90gHpaY4UJ1bR3sRUvtxP76gVHr-aywqAEsgcodJrD_ZMVOtRYLsRBL10WqvmoiESRcAxSTOYo_hpzIwjhsW-HOZxgvwkX6BygLo';

  // Parse tags
  let tags = ['CSE', 'CSE (AI & ML)', 'CSE (Data Science)', 'CSE (IoT)', 'ECE', 'ISE'];
  if (Array.isArray(row.tags)) {
    tags = row.tags;
  } else if (typeof row.tags === 'string') {
    tags = row.tags.split(',').map((t) => t.trim()).filter(Boolean);
  }

  // Parse branchIds
  let branchIds = ['cse', 'aiml', 'ds', 'iot', 'ece', 'ise'];
  if (Array.isArray(row.branch_ids || row.branchIds)) {
    branchIds = row.branch_ids || row.branchIds;
  }

  // Parse allowed_branches
  let allowedBranches = null;
  const rawAllowed = row.allowed_branches || row.allowedBranches;
  if (Array.isArray(rawAllowed)) {
    allowedBranches = rawAllowed;
  } else if (typeof rawAllowed === 'string') {
    allowedBranches = rawAllowed.split(',').map((b) => b.trim()).filter(Boolean);
  }

  // Parse eligible years
  let eligibleYears = ['1st', '2nd', '3rd', '4th'];
  if (Array.isArray(row.eligible_years || row.eligibleYears)) {
    eligibleYears = row.eligible_years || row.eligibleYears;
  }

  let yearNumbers = [1, 2, 3, 4];
  if (Array.isArray(row.year_numbers || row.yearNumbers)) {
    yearNumbers = row.year_numbers || row.yearNumbers;
  }

  const defaultAllowed = category === 'tech'
    ? ['CSE', 'CSE (AI & ML)', 'CSE (Data Science)', 'CSE (IoT)', 'ECE', 'ISE']
    : ['CSE', 'CSE (AI & ML)', 'CSE (Data Science)', 'CSE (IoT)', 'ECE', 'ISE', 'MECH', 'CIVIL'];

  return {
    id: String(row.id || row.event_id || Math.random()),
    title: row.title || row.name || 'Untitled Event',
    track: row.track || (category === 'tech' ? 'Tech Track' : 'Cultural Track'),
    badgeTrack: row.badge_track || (category === 'tech' ? 'Tech Track' : 'Cultural Track'),
    category,
    subCategory: (row.sub_category || row.subcategory || 'stage').toLowerCase(),
    tags,
    branchIds,
    allowed_branches: allowedBranches || defaultAllowed,
    allowedBranches: allowedBranches || defaultAllowed,
    eligibleYears,
    yearNumbers,
    date: row.date || row.event_date || 'Fall 2025',
    time: row.time || row.event_time || '10:00 AM - 4:00 PM',
    venue: row.venue || row.location || 'Campus Center',
    organizer: row.organizer || row.hosted_by || 'Student Council',
    deadline: row.deadline || row.registration_deadline || 'Open until filled',
    registered: Number(row.registered ?? row.registered_count ?? 0),
    capacity: Number(row.capacity ?? row.total_capacity ?? row.max_attendees ?? 60),
    status: row.is_open === false ? 'closed' : 'open',
    statusLabel: row.is_open === false ? 'Registration Closed' : 'Registration Open',
    format: row.format || 'Individual',
    badgeType: row.badge_type || (category === 'tech' ? 'Technical Workshop' : 'Cultural Fest'),
    fee: row.fee || 'Free Entry',
    icon: row.icon || (category === 'tech' ? 'terminal' : 'theater_comedy'),
    image: row.image || row.image_url || row.thumbnail_url || defaultImage,
    alt: row.alt || row.title,
    shortDesc: row.short_desc || row.short_description || row.description || '',
    longDesc: row.long_desc || row.long_description || row.description || row.short_desc || '',
    curriculum: Array.isArray(row.curriculum) ? row.curriculum : [],
    checklist: Array.isArray(row.checklist) ? row.checklist : ['College ID Card required for hall entry.'],
    prerequisiteNote: row.prerequisite_note || ''
  };
}

/**
 * Fetches events dynamically from Supabase public.events table where is_open = true.
 */
export async function fetchSupabaseEvents() {
  const { data, error, status, statusText } = await supabase
    .from('events')
    .select('*')
    .eq('is_open', true);

  if (error) {
    const diagnosticError = new Error(error.message || 'Failed to fetch events');
    diagnosticError.code = error.code;
    diagnosticError.status = status;
    diagnosticError.statusText = statusText;
    diagnosticError.hint = error.hint;
    diagnosticError.details = error.details;
    diagnosticError.table = 'public.events';
    throw diagnosticError;
  }

  return (data || []).map(normalizeEvent);
}

/**
 * Fallback static events data if database permissions or offline mode is used
 */
export { EVENTS_DATA as fallbackEvents };
