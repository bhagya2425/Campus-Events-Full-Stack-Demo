import React, { useState } from 'react';
import { ALL_BRANCHES } from '../data/eventsData';
import {
  submitRegistration,
  checkBranchEligibility,
  validateRegistrationForm
} from '../services/registrations';

export default function RegistrationPage({ event, onBack, onCompleteRegistration }) {
  if (!event) return null;

  const [fullName, setFullName] = useState('Aarav Sharma');
  const [usn, setUsn] = useState('1MS22CS045');
  const [branch, setBranch] = useState('CSE');
  const [selectedYear, setSelectedYear] = useState(2);
  const [email, setEmail] = useState('aarav.cs22@campus.edu');
  const [phone, setPhone] = useState('+91 98765 43210');

  // Async submission and status states
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [registeredPass, setRegisteredPass] = useState(null);

  // Department eligibility validation using allowed_branches
  const branchCheck = checkBranchEligibility(event, branch);
  const isBranchEligible = branchCheck.eligible;

  // Year eligibility check (some events like AI/ML Workshop require 2nd, 3rd, 4th year)
  const isYearEligible = event.yearNumbers
    ? event.yearNumbers.includes(selectedYear)
    : true;

  // Validate form fields
  const validation = validateRegistrationForm({ fullName, usn, branch, email, event });
  const isFormValid =
    isBranchEligible &&
    isYearEligible &&
    fullName.trim().length > 0 &&
    usn.trim().length > 0 &&
    email.trim().length > 0 &&
    branch.trim().length > 0 &&
    !submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage(null);

    // 1. Validate that all four fields are filled
    if (!fullName.trim() || !usn.trim() || !branch.trim() || !email.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'All four fields (Full Name, USN, Department, and College Email) must be filled.'
      });
      return;
    }

    // 2. Reject ineligible registrations with a clear message
    if (!isBranchEligible) {
      setStatusMessage({
        type: 'error',
        text: branchCheck.message
      });
      return;
    }

    if (!isYearEligible) {
      setStatusMessage({
        type: 'error',
        text: `Registration Ineligible: 1st Year students are not eligible for "${event.title}". This event is reserved for 2nd, 3rd, and 4th year students.`
      });
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitRegistration({
        event,
        fullName,
        usn,
        branch,
        email,
        phone,
        selectedYear
      });

      setRegisteredPass(result.passData);
      setStatusMessage({
        type: 'success',
        text: result.message || `Registration successfully confirmed for ${fullName.trim()} (${usn.trim().toUpperCase()})!`
      });

      // Show digital pass modal
      onCompleteRegistration(result.passData);
    } catch (err) {
      console.error('Registration submission diagnostic:', {
        message: err?.message,
        code: err?.code,
        status: err?.status,
        hint: err?.hint
      });

      if (err?.code === '23505') {
        setStatusMessage({
          type: 'duplicate',
          text: err.message || `Duplicate registration: A registration for USN ${usn.trim().toUpperCase()} already exists for this event.`
        });
      } else if (err?.code === '42501') {
        setStatusMessage({
          type: 'permission',
          text: 'Database Permission Required: Supabase public.registrations table requires INSERT permission for the anon role.',
          hint: 'GRANT INSERT ON public.registrations TO anon;'
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: err?.message || 'Failed to submit registration. Please try again.'
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full pb-28 max-w-xl mx-auto px-4 sm:px-6">
      {/* Top Stack Header */}
      <div className="pt-3 pb-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs sm:text-sm text-on-surface-variant hover:text-on-surface font-medium transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to Event</span>
        </button>
        <span className="text-xs text-on-surface-variant font-medium">Checkout Flow</span>
      </div>

      <div className="flex flex-col gap-5">
        {/* Event Summary Context Card */}
        <section className="bg-surface-container-low rounded-2xl p-4 sm:p-5 shadow-xs border border-surface-container relative overflow-hidden">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-xs bg-surface-container">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary text-[10px] sm:text-xs font-semibold">
                  <span className="material-symbols-outlined text-[12px]">{event.icon || 'terminal'}</span>
                  <span>{event.track}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-[10px] sm:text-xs font-semibold">
                  {event.fee}
                </span>
              </div>

              <h2 className="font-headline font-bold text-base sm:text-lg text-on-surface truncate">
                {event.title}
              </h2>
              <div className="flex items-center gap-1 text-on-surface-variant text-xs mt-0.5">
                <span className="material-symbols-outlined text-[14px] shrink-0 text-primary">calendar_today</span>
                <span className="truncate">{event.date} • {event.venue ? event.venue.split('(')[0] : 'Campus'}</span>
              </div>
            </div>
          </div>

          {/* Eligibility Matrix Criteria */}
          <div className="mt-3.5 pt-3 bg-surface-container/70 rounded-xl p-3 flex flex-col gap-2 border border-surface-container-high/60">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-primary">rule</span>
                Prerequisite Matrix
              </span>
              {event.yearNumbers && !event.yearNumbers.includes(1) && (
                <span className="text-[10px] font-bold text-tertiary-container bg-tertiary-fixed px-2 py-0.5 rounded-full">
                  1st Year Excluded
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1">
              {(branchCheck.allowedBranches || []).map((branchName) => (
                <span
                  key={branchName}
                  className="px-2 py-0.5 rounded-full bg-surface-container-lowest text-on-surface text-[10px] font-semibold shadow-xs"
                >
                  {branchName}
                </span>
              ))}
              {event.eligibleYears && (
                <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[10px] font-bold">
                  Years: {event.eligibleYears.join(', ')}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Real-time Dynamic Eligibility Banner */}
        <div
          className={`rounded-2xl p-4 transition-all duration-300 shadow-xs flex items-start gap-3 border ${
            !isYearEligible
              ? 'bg-error-container text-on-error-container border-error/30'
              : !isBranchEligible
              ? 'bg-amber-100 text-amber-950 border-amber-300'
              : 'bg-emerald-50 text-emerald-950 border-emerald-200'
          }`}
        >
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
              !isYearEligible
                ? 'bg-error text-white'
                : !isBranchEligible
                ? 'bg-amber-500 text-white'
                : 'bg-emerald-600 text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {!isYearEligible ? 'cancel' : !isBranchEligible ? 'warning' : 'check_circle'}
            </span>
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <h3 className="font-bold text-xs sm:text-sm">
              {!isYearEligible
                ? '⚠️ Ineligible: 1st Year Students Excluded'
                : !isBranchEligible
                ? `Department Restricted: ${branch}`
                : '✓ Eligibility Verified'}
            </h3>
            <p className="text-xs mt-0.5 leading-relaxed opacity-90">
              {!isYearEligible
                ? `${event.title} is designed for advanced collegiate standing (2nd, 3rd, or 4th Year only). 1st years are invited to attend foundational bootcamps.`
                : !isBranchEligible
                ? branchCheck.message
                : `Student from ${branch} (${selectedYear}${
                    selectedYear === 1 ? 'st' : selectedYear === 2 ? 'nd' : selectedYear === 3 ? 'rd' : 'th'
                  } Year) meets all eligibility criteria.`}
            </p>
          </div>
        </div>

        {/* Status Alerts: Success / Duplicate / Permission / Error */}
        {statusMessage && (
          <div
            className={`p-4 rounded-xl flex items-start gap-3 border shadow-xs animate-in fade-in duration-200 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : statusMessage.type === 'duplicate'
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-error-container border-error/40 text-on-error-container'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[22px] shrink-0 ${
                statusMessage.type === 'success'
                  ? 'text-emerald-700'
                  : statusMessage.type === 'duplicate'
                  ? 'text-amber-700'
                  : 'text-error'
              }`}
            >
              {statusMessage.type === 'success'
                ? 'check_circle'
                : statusMessage.type === 'duplicate'
                ? 'warning'
                : 'error'}
            </span>
            <div className="flex flex-col text-xs sm:text-sm flex-1">
              <span className="font-bold">
                {statusMessage.type === 'success'
                  ? 'Registration Confirmed!'
                  : statusMessage.type === 'duplicate'
                  ? 'Duplicate Registration'
                  : 'Registration Failed'}
              </span>
              <span className="mt-0.5 leading-relaxed">{statusMessage.text}</span>
              {statusMessage.hint && (
                <div className="mt-2 p-2 rounded bg-surface-container-high/80 text-[11px] font-mono text-on-surface">
                  <strong>Supabase SQL Fix:</strong> {statusMessage.hint}
                </div>
              )}
              {statusMessage.type === 'success' && registeredPass && (
                <button
                  type="button"
                  onClick={() => onCompleteRegistration(registeredPass)}
                  className="mt-3 inline-flex items-center gap-1.5 self-start px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-semibold text-xs shadow-xs hover:bg-emerald-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">qr_code</span>
                  <span>View Digital Pass</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Student Full Name (Required 1 of 4) */}
          <div className="flex flex-col gap-1">
            <label htmlFor="full-name" className="text-xs font-bold text-on-surface flex items-center gap-1">
              <span>Student Full Name</span>
              <span className="text-error">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[19px] text-outline pointer-events-none">
                person
              </span>
              <input
                id="full-name"
                type="text"
                required
                disabled={submitting}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full h-12 pl-10 pr-4 bg-surface-container-lowest text-on-surface text-sm rounded-xl shadow-xs border border-surface-container outline-none focus:border-primary focus:bg-surface-bright transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* USN Number (Required 2 of 4) */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label htmlFor="usn" className="text-xs font-bold text-on-surface flex items-center gap-1">
                <span>University Serial Number (USN)</span>
                <span className="text-error">*</span>
              </label>
              <span className="text-[11px] text-on-surface-variant font-medium">Format: 1MS22CS045</span>
            </div>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[19px] text-outline pointer-events-none">
                badge
              </span>
              <input
                id="usn"
                type="text"
                required
                disabled={submitting}
                value={usn}
                onChange={(e) => setUsn(e.target.value.toUpperCase())}
                placeholder="e.g. 1MS22CS045"
                className="w-full h-12 pl-10 pr-4 uppercase tracking-wider font-semibold bg-surface-container-lowest text-on-surface text-sm rounded-xl shadow-xs border border-surface-container outline-none focus:border-primary focus:bg-surface-bright transition-all font-mono disabled:opacity-60"
              />
            </div>
          </div>

          {/* Department Selection (Required 3 of 4) */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label htmlFor="branch-select" className="text-xs font-bold text-on-surface flex items-center gap-1">
                <span>Engineering Department</span>
                <span className="text-error">*</span>
              </label>
              <span className="text-[11px] text-on-surface-variant font-medium">Checked via allowed_branches</span>
            </div>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[19px] text-outline pointer-events-none">
                account_tree
              </span>
              <select
                id="branch-select"
                disabled={submitting}
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full h-12 pl-10 pr-10 bg-surface-container-lowest text-on-surface text-sm rounded-xl shadow-xs border border-surface-container outline-none appearance-none focus:border-primary focus:bg-surface-bright transition-all disabled:opacity-60"
              >
                <option value="CSE">Computer Science &amp; Engineering (CSE)</option>
                <option value="CSE (AI &amp; ML)">CSE (AI &amp; Machine Learning)</option>
                <option value="CSE (Data Science)">CSE (Data Science)</option>
                <option value="CSE (IoT)">CSE (Internet of Things)</option>
                <option value="ECE">Electronics &amp; Communication (ECE)</option>
                <option value="ISE">Information Science &amp; Engineering (ISE)</option>
                <option value="MECH">Mechanical Engineering (MECH - Restricted)</option>
                <option value="CIVIL">Civil Engineering (CIVIL - Restricted)</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 text-[20px] text-outline pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Institutional College Email (Required 4 of 4) */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-xs font-bold text-on-surface flex items-center gap-1">
              <span>Institutional College Email</span>
              <span className="text-error">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[19px] text-outline pointer-events-none">
                mail
              </span>
              <input
                id="email"
                type="email"
                required
                disabled={submitting}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aarav.cs22@campus.edu"
                className="w-full h-12 pl-10 pr-4 bg-surface-container-lowest text-on-surface text-sm rounded-xl shadow-xs border border-surface-container outline-none focus:border-primary focus:bg-surface-bright transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* Study Year Segmented Selection */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-on-surface flex items-center gap-1">
                <span>Current Year of Study</span>
                <span className="text-error">*</span>
              </label>
              <span className="text-[11px] text-on-surface-variant">Select active batch</span>
            </div>

            <div className="grid grid-cols-4 gap-2 bg-surface-container-low p-1.5 rounded-xl border border-surface-container">
              {[1, 2, 3, 4].map((yr) => {
                const isSelected = selectedYear === yr;
                return (
                  <button
                    key={yr}
                    type="button"
                    disabled={submitting}
                    onClick={() => setSelectedYear(yr)}
                    className={`py-2 px-1 rounded-lg text-center text-xs font-semibold transition-all flex flex-col items-center gap-0.5 ${
                      isSelected
                        ? 'bg-primary text-on-primary shadow-sm font-bold'
                        : 'text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    <span>{yr}{yr === 1 ? 'st' : yr === 2 ? 'nd' : yr === 3 ? 'rd' : 'th'} Yr</span>
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected
                          ? 'bg-on-primary'
                          : yr === 1 && event.yearNumbers && !event.yearNumbers.includes(1)
                          ? 'bg-error opacity-60'
                          : 'bg-transparent'
                      }`}
                    ></span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* WhatsApp / Mobile Number */}
          <div className="flex flex-col gap-1">
            <label htmlFor="phone" className="text-xs font-bold text-on-surface flex items-center gap-1">
              <span>WhatsApp / Contact Number</span>
              <span className="text-outline text-[11px] font-normal">(For venue reminders)</span>
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[19px] text-outline pointer-events-none">
                call
              </span>
              <input
                id="phone"
                type="tel"
                disabled={submitting}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full h-12 pl-10 pr-4 bg-surface-container-lowest text-on-surface text-sm rounded-xl shadow-xs border border-surface-container outline-none focus:border-primary focus:bg-surface-bright transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* Capacity Mini Progress */}
          <div className="bg-surface-container-low p-3.5 rounded-xl flex flex-col gap-1.5 border border-surface-container/60">
            <div className="flex items-center justify-between text-xs text-on-surface-variant">
              <span className="flex items-center gap-1 text-on-surface font-semibold">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Event Registration Status
              </span>
              <span className="font-bold text-primary">
                {event.registered || 0} / {event.capacity || 60} seats filled
              </span>
            </div>
            <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.round(((event.registered || 0) / (event.capacity || 60)) * 100))}%`
                }}
              ></div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!isFormValid || submitting}
              className={`w-full h-12 font-semibold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all ${
                isFormValid && !submitting
                  ? 'bg-primary text-on-primary hover:bg-surface-tint active:scale-98 cursor-pointer'
                  : 'bg-surface-container-highest text-outline cursor-not-allowed opacity-70 shadow-none'
              }`}
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Connecting to Supabase...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                  <span>
                    {!isYearEligible
                      ? 'Registration Ineligible (Year Restricted)'
                      : !isBranchEligible
                      ? 'Branch Ineligible (Restricted)'
                      : 'Confirm & Register in Supabase'}
                  </span>
                </>
              )}
            </button>

            <p className="text-center text-[11px] text-on-surface-variant mt-2">
              Registration data is securely recorded in the <code className="font-mono text-primary">registrations</code> table.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
