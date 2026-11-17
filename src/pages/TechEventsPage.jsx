import React, { useState } from 'react';
import EventCard from '../components/EventCard';
import { LoadingSkeleton, ErrorState } from '../components/StatusAlert';

export default function TechEventsPage({
  setActiveScreen,
  onSelectEvent,
  onRegister,
  events = [],
  loading = false,
  error = null,
  onRetry,
  onUseFallback
}) {
  const [selectedBranch, setSelectedBranch] = useState('all');

  const techEvents = events.filter((e) => e.category === 'tech');

  const filteredEvents = techEvents.filter((event) => {
    if (selectedBranch === 'all') return true;
    return event.branchIds?.includes(selectedBranch);
  });

  const branchPills = [
    { id: 'all', label: 'All Branches', icon: 'select_all' },
    { id: 'cse', label: 'CSE' },
    { id: 'aiml', label: 'CSE (AI & ML)' },
    { id: 'ds', label: 'CSE (Data Science)' },
    { id: 'iot', label: 'CSE (IoT)' },
    { id: 'ece', label: 'ECE' },
    { id: 'ise', label: 'ISE' },
  ];

  return (
    <div className="flex flex-col w-full pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb & Section Header */}
      <div className="pt-3 pb-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-on-surface-variant text-xs sm:text-sm">
          <button
            onClick={() => setActiveScreen('home')}
            className="hover:text-primary transition-colors flex items-center gap-1 font-medium"
          >
            <span className="material-symbols-outlined text-[16px]">home</span>
            <span>Home</span>
          </button>
          <span className="text-outline-variant">/</span>
          <span className="text-primary font-bold">Tech Events</span>
        </div>

        <div className="mt-1 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-on-surface tracking-tight">
              Technical Events &amp; Workshops
            </h1>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary text-xs font-semibold">
              <span className="material-symbols-outlined text-[15px]">terminal</span>
              <span>Fall 2025</span>
            </div>
          </div>
          <p className="text-sm text-on-surface-variant">
            Upskill, build production architectures, and compete in college-wide tech arenas.
          </p>
        </div>
      </div>

      {/* Branch Filter Segmented Bar */}
      <div className="w-full overflow-x-auto no-scrollbar py-2 mb-4 flex items-center gap-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {branchPills.map((pill) => {
          const isActive = selectedBranch === pill.id;
          return (
            <button
              key={pill.id}
              onClick={() => setSelectedBranch(pill.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-95 flex items-center gap-1.5 shrink-0 ${
                isActive
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {pill.icon && (
                <span className="material-symbols-outlined text-[16px]">{pill.icon}</span>
              )}
              <span>{pill.label}</span>
            </button>
          );
        })}
      </div>

      {/* Real-time Stats & Track Quick Glance */}
      <div className="mb-6">
        <div className="bg-surface-container-low rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-xs border border-surface-container">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[22px]">bolt</span>
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-on-surface truncate">
                {loading ? 'Connecting to Supabase...' : `${techEvents.length} Active Tech Events`}
              </div>
              <div className="text-xs text-on-surface-variant truncate">
                {loading ? 'Querying public.events table...' : 'Filtered by open registration status (is_open = true)'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-primary shrink-0 pl-2">
            <span className="material-symbols-outlined text-[20px]">verified</span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && <LoadingSkeleton count={4} />}

      {/* Error State */}
      {error && !loading && (
        <ErrorState error={error} onRetry={onRetry} onUseFallback={onUseFallback} />
      )}

      {/* Event Cards Grid */}
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
          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-primary mb-3">
            <span className="material-symbols-outlined text-[32px]">filter_alt_off</span>
          </div>
          <div className="font-headline font-bold text-lg text-on-surface mb-1">
            No active events found for this filter
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-sm mb-4">
            Try selecting "All Branches" or reset your department filters.
          </p>
          <button
            onClick={() => setSelectedBranch('all')}
            className="h-10 px-4 bg-primary text-on-primary font-semibold text-xs sm:text-sm rounded-xl active:scale-95 transition-all shadow"
          >
            Reset to All Branches
          </button>
        </div>
      )}

      {/* Guidelines Callout */}
      <div className="mt-8">
        <div className="bg-surface-container rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 border border-surface-container-high/60">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">help_center</span>
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-on-surface">Registration Guidelines</h3>
              <p className="text-xs text-on-surface-variant truncate">
                College ID cards and registered laptop hardware required for laboratory check-in.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveScreen('about')}
            className="flex items-center gap-1 text-primary text-xs font-bold hover:underline shrink-0"
          >
            <span>Read Rules</span>
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}
