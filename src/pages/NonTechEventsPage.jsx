import React, { useState } from 'react';
import EventCard from '../components/EventCard';
import { LoadingSkeleton, ErrorState } from '../components/StatusAlert';

export default function NonTechEventsPage({
  setActiveScreen,
  onSelectEvent,
  onRegister,
  events = [],
  loading = false,
  error = null,
  onRetry,
  onUseFallback
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const nonTechEvents = events.filter((e) => e.category === 'non-tech');

  const filteredEvents = nonTechEvents.filter((event) => {
    if (selectedCategory === 'all') return true;
    return event.subCategory === selectedCategory;
  });

  const categories = [
    { id: 'all', label: 'All Non-Tech', count: nonTechEvents.length, icon: 'celebration' },
    { id: 'stage', label: 'Stage Arts', icon: 'theater_comedy' },
    { id: 'music-dance', label: 'Music & Dance', icon: 'music_note' },
    { id: 'visual', label: 'Visual Media', icon: 'photo_camera' },
  ];

  return (
    <div className="flex flex-col w-full pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb & Section Header */}
      <div className="pt-3 pb-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-on-surface-variant text-xs sm:text-sm">
          <button
            onClick={() => setActiveScreen('home')}
            className="hover:text-tertiary transition-colors flex items-center gap-1 font-medium"
          >
            <span className="material-symbols-outlined text-[16px]">home</span>
            <span>Home</span>
          </button>
          <span className="text-outline-variant">/</span>
          <span className="text-tertiary font-bold">Non-Tech Events</span>
        </div>

        <div className="mt-1 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold uppercase tracking-wider">
              Arts &amp; Expression
            </span>
            <span className="flex items-center text-tertiary text-xs font-semibold gap-0.5">
              <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
              Fall Fest 2025
            </span>
          </div>

          <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-on-surface tracking-tight">
            Cultural &amp; Creative Events
          </h1>
          <p className="text-sm text-on-surface-variant max-w-2xl">
            Showcase your artistic passions, stage presence, and campus spirit across vibrant collegiate competitions.
          </p>
        </div>
      </div>

      {/* Interactive Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-5 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-95 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-tertiary text-on-tertiary shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">{cat.icon}</span>
              <span>{cat.label}</span>
              {cat.count !== undefined && (
                <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-tertiary-container text-white' : 'bg-surface-container-high text-on-surface'
                }`}>
                  {cat.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Loading State */}
      {loading && <LoadingSkeleton count={4} />}

      {/* Error State */}
      {error && !loading && (
        <ErrorState error={error} onRetry={onRetry} onUseFallback={onUseFallback} />
      )}

      {/* Event Cards Feed */}
      {!loading && !error && filteredEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 sm:gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onSelectEvent={onSelectEvent}
              onRegister={onRegister}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredEvents.length === 0 && (
        <div className="py-16 flex flex-col items-center justify-center text-center bg-surface-container-low rounded-2xl border border-surface-container p-6">
          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-tertiary mb-3">
            <span className="material-symbols-outlined text-[32px]">filter_alt_off</span>
          </div>
          <div className="font-headline font-bold text-lg text-on-surface mb-1">
            No active cultural events found for this category
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-sm mb-4">
            Try selecting "All Non-Tech" to view all available arts, music, and stage events.
          </p>
          <button
            onClick={() => setSelectedCategory('all')}
            className="h-10 px-4 bg-tertiary text-on-tertiary font-semibold text-xs sm:text-sm rounded-xl active:scale-95 transition-all shadow"
          >
            Reset Category Filter
          </button>
        </div>
      )}

      {/* Warm Cultural Support & Guidelines Card */}
      <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed flex flex-col gap-3 shadow-xs relative overflow-hidden border border-tertiary-fixed-dim/60">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-[26px] text-tertiary shrink-0 mt-0.5">
            palette
          </span>
          <div className="flex flex-col gap-1">
            <h3 className="font-headline font-bold text-base sm:text-lg text-on-tertiary-fixed">
              Have a New Cultural Event Idea?
            </h3>
            <p className="text-xs sm:text-sm text-on-tertiary-fixed-variant leading-relaxed">
              Campus clubs and fine arts societies can submit auditorium bookings, stage slot reservations, and budget approvals directly to the Student Welfare Cultural Directorate.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => alert('Event Proposal Form: Open to verified Student Council leaders. Please email studentaffairs@campus.edu.')}
                className="px-4 py-2 rounded-xl bg-tertiary text-on-tertiary text-xs sm:text-sm font-semibold active:scale-95 transition-all shadow-xs"
              >
                Propose Club Event
              </button>
              <button
                onClick={() => alert('Downloading Cultural Fest 2025 Rulebook (PDF)...')}
                className="text-xs sm:text-sm text-tertiary font-bold underline underline-offset-2 hover:opacity-80"
              >
                Download Rulebook (PDF)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
