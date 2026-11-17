import React from 'react';

export default function EventDetailsPage({ event, onBack, onRegister }) {
  if (!event) return null;

  const isClosed = event.status === 'closed';
  const isTech = event.category === 'tech';
  const percentFilled = Math.min(100, Math.round((event.registered / event.capacity) * 100));
  const seatsLeft = Math.max(0, event.capacity - event.registered);

  return (
    <div className="flex flex-col w-full pb-28 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Top Breadcrumb Navigation */}
      <div className="pt-3 pb-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs sm:text-sm text-on-surface-variant hover:text-on-surface font-medium transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to events</span>
        </button>
        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
          isTech ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-tertiary-fixed text-on-tertiary-fixed'
        }`}>
          {event.track}
        </span>
      </div>

      {/* Hero Visual Card */}
      <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md bg-inverse-surface aspect-[16/9] mb-4 flex flex-col justify-end border border-surface-container">
        <img
          src={event.image}
          alt={event.alt || event.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface via-inverse-surface/40 to-transparent"></div>

        <div className="relative z-10 p-4 sm:p-6 flex items-end justify-between gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface/90 backdrop-blur-md shadow-sm">
            {isClosed ? (
              <>
                <span className="material-symbols-outlined text-[14px] text-outline">lock</span>
                <span className="text-xs font-semibold text-on-surface">Registration Closed</span>
              </>
            ) : (
              <>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-semibold text-on-surface">Registration Open</span>
              </>
            )}
          </div>

          <span className="text-xs text-inverse-on-surface/90 px-3 py-1 rounded-full bg-inverse-surface/75 backdrop-blur-md font-medium">
            {event.badgeType || 'Campus Event'}
          </span>
        </div>
      </div>

      {/* Main Title & Organizer Details */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-high text-primary text-xs font-semibold">
            <span className="material-symbols-outlined text-[14px]">{event.icon || 'terminal'}</span>
            <span>{event.track}</span>
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold">
            <span className="material-symbols-outlined text-[14px]">school</span>
            <span>{event.format}</span>
          </span>
        </div>

        <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-on-surface tracking-tight leading-tight">
          {event.title}
        </h1>

        <div className="flex items-center gap-1.5 text-on-surface-variant text-xs sm:text-sm">
          <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
          <span>
            Organized by <strong className="text-on-surface font-semibold">{event.organizer}</strong>
          </span>
        </div>
      </div>

      <div className="space-y-5">
        {/* Capacity & Logistics Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-xs border border-surface-container space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">how_to_reg</span>
              <span className="text-sm font-bold text-on-surface">Capacity Status</span>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
              isClosed ? 'bg-surface-container text-on-surface-variant' : 'bg-tertiary-fixed text-tertiary-container'
            }`}>
              {isClosed ? 'Capacity Reached' : `${seatsLeft} seats remaining`}
            </span>
          </div>

          <div>
            <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isClosed ? 'bg-outline w-full' : isTech ? 'bg-primary' : 'bg-tertiary'
                }`}
                style={{ width: isClosed ? '100%' : `${percentFilled}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-2 text-xs text-on-surface-variant">
              <span>{event.registered} registered delegates</span>
              <span>{event.capacity} total hall capacity</span>
            </div>
          </div>

          {/* Schedule 2x2 Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-surface-container-low rounded-xl p-3.5 flex items-start gap-2.5 border border-surface-container/60">
              <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-primary">
                <span className="material-symbols-outlined text-[20px]">calendar_today</span>
              </div>
              <div className="min-w-0">
                <span className="block text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">Date</span>
                <span className="block text-xs sm:text-sm text-on-surface font-bold truncate">{event.date}</span>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-xl p-3.5 flex items-start gap-2.5 border border-surface-container/60">
              <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-primary">
                <span className="material-symbols-outlined text-[20px]">schedule</span>
              </div>
              <div className="min-w-0">
                <span className="block text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">Time</span>
                <span className="block text-xs sm:text-sm text-on-surface font-bold truncate">{event.time}</span>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-xl p-3.5 flex items-start gap-2.5 border border-surface-container/60">
              <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-secondary">
                <span className="material-symbols-outlined text-[20px]">domain</span>
              </div>
              <div className="min-w-0">
                <span className="block text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">Venue</span>
                <span className="block text-xs sm:text-sm text-on-surface font-bold truncate">{event.venue}</span>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-xl p-3.5 flex items-start gap-2.5 border border-surface-container/60">
              <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-error">
                <span className="material-symbols-outlined text-[20px]">alarm</span>
              </div>
              <div className="min-w-0">
                <span className="block text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">Registration Deadline</span>
                <span className="block text-xs sm:text-sm text-error font-bold truncate">{event.deadline}</span>
              </div>
            </div>
          </div>
        </div>

        {/* About Event Description */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-xs border border-surface-container">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary text-[22px]">info</span>
            <h3 className="font-headline font-bold text-lg text-on-surface">About the Event</h3>
          </div>
          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
            {event.longDesc || event.shortDesc}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-surface-container flex items-center gap-2.5 border border-surface-container-high/60">
              <span className="material-symbols-outlined text-primary text-[22px]">workspace_premium</span>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-on-surface">Certificate</span>
                <span className="block text-[11px] text-on-surface-variant truncate">Official Credential</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-container flex items-center gap-2.5 border border-surface-container-high/60">
              <span className="material-symbols-outlined text-secondary text-[22px]">group</span>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-on-surface">Format</span>
                <span className="block text-[11px] text-on-surface-variant truncate">{event.format}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Curriculum Flow Timeline */}
        {event.curriculum && event.curriculum.length > 0 && (
          <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-xs border border-surface-container">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">event_note</span>
                <h3 className="font-headline font-bold text-lg text-on-surface">Curriculum Flow</h3>
              </div>
              <span className="text-[11px] font-semibold text-on-surface-variant bg-surface-container px-3 py-1 rounded-full">
                {event.curriculum.length} Sprints
              </span>
            </div>

            <div className="space-y-4 relative before:absolute before:left-[17px] before:top-4 before:bottom-4 before:w-0.5 before:bg-surface-container">
              {event.curriculum.map((item, index) => (
                <div key={item.step || index} className="relative flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 z-10 shadow-xs text-xs font-bold font-mono">
                    {item.step}
                  </div>
                  <div className="flex-1 bg-surface-container-low rounded-xl p-3.5 border border-surface-container/60">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-primary">{item.time}</span>
                      <span className="text-[11px] text-on-surface-variant font-medium">{item.duration}</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-on-surface mb-1">{item.title}</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Eligibility & Requirements */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-xs border border-surface-container space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">assignment_turned_in</span>
            <h3 className="font-headline font-bold text-lg text-on-surface">Eligibility &amp; Checklist</h3>
          </div>

          <div>
            <span className="block text-xs font-bold text-on-surface mb-2">Approved Engineering Branches</span>
            <div className="flex flex-wrap gap-1.5">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-surface-container text-on-surface text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="block text-xs font-bold text-on-surface mb-2">Eligible Study Years</span>
            <div className="flex items-center gap-2 mb-2">
              {event.eligibleYears.map((yr) => (
                <span
                  key={yr}
                  className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-semibold"
                >
                  {yr} Year
                </span>
              ))}
            </div>
            {event.prerequisiteNote && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-surface-container-low text-on-surface-variant text-xs border border-surface-container/60">
                <span className="material-symbols-outlined text-[18px] text-tertiary shrink-0 mt-0.5">announcement</span>
                <span className="leading-snug">{event.prerequisiteNote}</span>
              </div>
            )}
          </div>

          {event.checklist && (
            <div className="space-y-2 pt-2 border-t border-surface-container/60">
              <span className="block text-xs font-bold text-on-surface">Participant Requirements</span>
              {event.checklist.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-[17px] shrink-0 mt-0.5">check_circle</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Help & Support Tile */}
        <div className="bg-surface-container rounded-2xl p-4 sm:p-5 flex items-center justify-between border border-surface-container-high/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">help_outline</span>
            </div>
            <div>
              <span className="block text-xs sm:text-sm font-bold text-on-surface">Have questions?</span>
              <span className="block text-xs text-on-surface-variant">Contact the student coordinating team</span>
            </div>
          </div>
          <button
            onClick={() => alert(`Contacting ${event.organizer} via student portal...`)}
            className="px-3.5 py-1.5 rounded-full bg-surface-container-lowest text-primary font-semibold text-xs shadow-xs hover:bg-surface-bright active:scale-95 transition-all"
          >
            Message
          </button>
        </div>
      </div>

      {/* Floating Bottom Sticky Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-xl shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-4 sm:px-6 py-3 pb-safe border-t border-surface-container">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className={`inline-block w-2 h-2 rounded-full ${isClosed ? 'bg-outline' : 'bg-emerald-500'}`}></span>
              <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                {event.fee}
              </span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-on-surface">
              {isClosed ? 'Capacity Full' : `${seatsLeft} Seats Remaining`}
            </span>
          </div>

          {isClosed ? (
            <button
              disabled
              className="flex-1 max-w-[220px] h-12 rounded-xl bg-surface-container text-outline font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
            >
              <span>Capacity Full</span>
              <span className="material-symbols-outlined text-[18px]">lock</span>
            </button>
          ) : (
            <button
              onClick={() => onRegister(event)}
              className={`flex-1 max-w-[220px] h-12 rounded-xl text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all ${
                isTech ? 'bg-primary hover:bg-surface-tint' : 'bg-tertiary hover:bg-tertiary-container'
              }`}
            >
              <span>Register Now</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
