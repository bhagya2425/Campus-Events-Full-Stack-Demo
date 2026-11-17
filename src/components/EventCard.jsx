import React from 'react';

export default function EventCard({ event, onSelectEvent, onRegister }) {
  const percentFilled = Math.min(100, Math.round((event.registered / event.capacity) * 100));
  const isClosed = event.status === 'closed';
  const isTech = event.category === 'tech';

  return (
    <article className="event-card group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col border border-surface-container/60">
      {/* Media Header with Ambient Overlay */}
      <div className="relative w-full h-44 sm:h-48 bg-surface-container overflow-hidden">
        <img
          src={event.image}
          alt={event.alt || event.title}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
            isClosed ? 'grayscale-[30%]' : ''
          }`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/85 via-inverse-surface/20 to-transparent"></div>

        {/* Top Badges: Live Status & Format */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-lowest/95 backdrop-blur-sm text-on-surface shadow-sm text-xs font-semibold">
          {isClosed ? (
            <>
              <span className="material-symbols-outlined text-[14px] text-outline">lock</span>
              <span className="text-on-surface-variant">Registration Closed</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-emerald-800">Registration Open</span>
            </>
          )}
        </div>

        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-surface-container/90 backdrop-blur-md text-primary text-xs font-bold flex items-center gap-1 shadow-sm">
          <span className="material-symbols-outlined text-[13px]">{event.icon || 'person'}</span>
          <span>{event.format}</span>
        </div>

        {/* Bottom Banner Over Image: Date & Time */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-surface-bright">
          <div className="flex items-center gap-1 text-xs font-semibold drop-shadow">
            <span className="material-symbols-outlined text-[15px] text-tertiary-fixed">calendar_today</span>
            <span>{event.date}</span>
          </div>
          <span className="text-[11px] bg-inverse-surface/75 px-2 py-0.5 rounded backdrop-blur-sm text-surface-container-low font-medium">
            {event.time}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex flex-col gap-3.5 flex-1 justify-between">
        <div className="flex flex-col gap-2.5">
          {/* Title & Venue */}
          <div className="flex flex-col gap-1">
            <h2
              onClick={() => onSelectEvent(event)}
              className="font-headline font-bold text-lg text-on-surface group-hover:text-primary transition-colors cursor-pointer leading-snug"
            >
              {event.title}
            </h2>
            <div className="flex items-center gap-1.5 text-on-surface-variant text-xs">
              <span className={`material-symbols-outlined text-[16px] shrink-0 ${isTech ? 'text-primary' : 'text-tertiary'}`}>
                location_on
              </span>
              <span className="truncate">{event.venue}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-on-surface-variant line-clamp-2 leading-relaxed">
            {event.shortDesc}
          </p>

          {/* Requirements Callout */}
          <div className="p-2.5 bg-surface-container-low rounded-xl flex items-start gap-2 border border-surface-container/50">
            <span className={`material-symbols-outlined text-[17px] shrink-0 mt-0.5 ${isTech ? 'text-primary' : 'text-tertiary'}`}>
              {isTech ? 'laptop_mac' : 'verified'}
            </span>
            <div className="text-xs text-on-surface flex-1">
              <span className="font-semibold">Requirement: </span>
              {event.checklist?.[0] || 'College ID Card required'}
            </div>
          </div>

          {/* Eligible Branches & Years */}
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">
              Eligible Departments
            </div>
            <div className="flex flex-wrap gap-1">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface text-[11px] font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
              <span>Years:</span>
              <div className="flex gap-1">
                {event.eligibleYears.map((yr) => (
                  <span
                    key={yr}
                    className="px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface text-[10px] font-semibold"
                  >
                    {yr}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <span className={`text-xs font-bold ${isClosed ? 'text-on-surface-variant' : isTech ? 'text-primary' : 'text-tertiary'}`}>
                {isClosed ? 'Full (60/60)' : `${event.registered} / ${event.capacity} Filled`}
              </span>
            </div>
          </div>

          {/* Capacity Progress Bar */}
          <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isClosed
                  ? 'bg-outline w-full'
                  : isTech
                  ? 'bg-primary'
                  : 'bg-tertiary'
              }`}
              style={{ width: isClosed ? '100%' : `${percentFilled}%` }}
            ></div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {isClosed ? (
            <button
              onClick={() => onSelectEvent(event)}
              className="w-full h-11 px-4 bg-surface-container text-on-surface-variant font-semibold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors"
            >
              <span>View Details (Closed)</span>
              <span className="material-symbols-outlined text-[18px]">lock</span>
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onSelectEvent(event)}
                className="h-11 px-3 bg-surface-container text-on-surface font-semibold text-xs sm:text-sm rounded-xl hover:bg-surface-container-high active:scale-95 transition-all flex items-center justify-center gap-1.5 border border-surface-container-high"
              >
                <span>Details</span>
                <span className="material-symbols-outlined text-[16px]">visibility</span>
              </button>
              <button
                onClick={() => onRegister(event)}
                className={`h-11 px-3 text-white font-semibold text-xs sm:text-sm rounded-xl shadow active:scale-95 transition-all flex items-center justify-center gap-1.5 ${
                  isTech
                    ? 'bg-primary hover:bg-surface-tint'
                    : 'bg-tertiary hover:bg-tertiary-container'
                }`}
              >
                <span>Register</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
