import React from 'react';
import { ALL_BRANCHES, ALL_YEARS } from '../data/eventsData';
import { LoadingSkeleton, ErrorState } from '../components/StatusAlert';

export default function HomePage({
  setActiveScreen,
  onSelectEvent,
  onRegister,
  events = [],
  loading = false,
  error = null,
  onRetry,
  onUseFallback
}) {
  const spotlightEvents = events.slice(0, 4);
  const techCount = events.filter((e) => e.category === 'tech').length;
  const nonTechCount = events.filter((e) => e.category === 'non-tech').length;

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Announcement Ribbon */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pt-3 pb-2">
        <div className="flex items-center gap-2 px-3.5 py-2.5 bg-surface-container rounded-xl text-primary shadow-xs border border-surface-container-high/60 overflow-hidden">
          <span className="material-symbols-filled text-[18px] shrink-0 text-primary animate-pulse">campaign</span>
          <p className="text-xs sm:text-sm truncate text-on-surface">
            <span className="font-bold text-primary">Official Portal: </span>
            Open to CSE, CSE (AI &amp; ML), CSE (Data Science), CSE (IoT), ECE &amp; ISE students
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pt-3 pb-5 flex flex-col gap-3">
        <div className="flex flex-col gap-1.5 max-w-3xl">
          <span className="text-xs uppercase tracking-wider text-primary font-bold">
            Campus Life 2025
          </span>
          <h1 className="font-headline font-extrabold text-2xl sm:text-4xl text-on-surface tracking-tight leading-tight">
            Discover What's Happening on Campus
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
            Explore technical hackathons, artistic fests, workshops and coding arenas. Connect across departments and build lasting collegiate memories.
          </p>
        </div>

        {/* Quick Stats Pill Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container-high text-on-surface shrink-0 shadow-xs border border-surface-container">
            <span className="material-symbols-filled text-[15px] text-primary">calendar_month</span>
            <span className="text-xs font-semibold">
              {loading ? 'Loading Events...' : `${events.length} Live Open Events`}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container-high text-on-surface shrink-0 shadow-xs border border-surface-container">
            <span className="material-symbols-filled text-[15px] text-secondary">hub</span>
            <span className="text-xs font-semibold">6 Engineering Branches</span>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container-high text-on-surface shrink-0 shadow-xs border border-surface-container">
            <span className="material-symbols-filled text-[15px] text-tertiary-container">verified</span>
            <span className="text-xs font-semibold">100% Free / Sponsored</span>
          </div>
        </div>
      </section>

      {/* Error state if Supabase connection fails */}
      {error && (
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <ErrorState error={error} onRetry={onRetry} onUseFallback={onUseFallback} />
        </div>
      )}

      {/* Category Spotlight Cards (Dual Tracks) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Tech Events Card */}
          <div className="relative overflow-hidden rounded-2xl bg-inverse-surface text-inverse-on-surface shadow-md p-5 sm:p-6 flex flex-col justify-between gap-4 border border-slate-700/60 hover:shadow-xl transition-all">
            {/* Ambient glowing blobs */}
            <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-primary-container opacity-35 blur-2xl pointer-events-none"></div>
            <div className="absolute right-8 bottom-0 w-36 h-36 rounded-full bg-secondary-container opacity-25 blur-xl pointer-events-none"></div>

            <div className="flex flex-col gap-3 z-10">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-surface-container-lowest/10 backdrop-blur-md flex items-center justify-center text-primary-fixed shadow-inner border border-white/10">
                  <span className="material-symbols-outlined text-[26px]">terminal</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container/40 backdrop-blur-sm text-on-primary text-xs font-semibold border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>{loading ? 'Checking...' : `${techCount} Active Tech Events`}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <h2 className="font-headline font-bold text-xl sm:text-2xl text-inverse-on-surface tracking-tight">
                  Tech Events
                </h2>
                <p className="text-xs sm:text-sm text-surface-variant opacity-90 leading-relaxed">
                  Hackathons, AI workshops, coding competitions, and hands-on system building.
                </p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 my-1">
                <span className="px-2.5 py-1 rounded-full bg-white/10 text-on-primary-container text-xs font-medium backdrop-blur-xs">
                  AI &amp; ML
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/10 text-on-primary-container text-xs font-medium backdrop-blur-xs">
                  Web Dev
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/10 text-on-primary-container text-xs font-medium backdrop-blur-xs">
                  Algothon
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/10 text-on-primary-container text-xs font-medium backdrop-blur-xs">
                  InnoSprint
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveScreen('tech')}
              className="z-10 mt-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary-container text-on-primary font-semibold text-sm shadow hover:opacity-95 active:scale-95 transition-all"
            >
              <span>Explore Tech Events</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>

          {/* Non-Tech Events Card */}
          <div className="relative overflow-hidden rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed shadow-md p-5 sm:p-6 flex flex-col justify-between gap-4 border border-tertiary-fixed-dim/60 hover:shadow-xl transition-all">
            {/* Ambient warm glow */}
            <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-tertiary-container opacity-25 blur-2xl pointer-events-none"></div>
            <div className="absolute -left-6 -bottom-6 w-36 h-36 rounded-full bg-tertiary-fixed-dim opacity-40 blur-xl pointer-events-none"></div>

            <div className="flex flex-col gap-3 z-10">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center text-tertiary shadow-sm">
                  <span className="material-symbols-outlined text-[26px]">theater_comedy</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary text-on-tertiary text-xs font-semibold shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
                  <span>{loading ? 'Checking...' : `${nonTechCount} Cultural Tracks`}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <h2 className="font-headline font-bold text-xl sm:text-2xl text-on-tertiary-fixed tracking-tight">
                  Non-Tech Events
                </h2>
                <p className="text-xs sm:text-sm text-on-tertiary-fixed-variant leading-relaxed">
                  Cultural fests, dance championships, acoustic music recitals &amp; photography galleries.
                </p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 my-1">
                <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest/80 text-on-tertiary-fixed text-xs font-semibold">
                  Aarohan Fest
                </span>
                <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest/80 text-on-tertiary-fixed text-xs font-semibold">
                  Step Up Dance
                </span>
                <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest/80 text-on-tertiary-fixed text-xs font-semibold">
                  Voice of Campus
                </span>
                <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest/80 text-on-tertiary-fixed text-xs font-semibold">
                  Photography
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveScreen('non-tech')}
              className="z-10 mt-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-tertiary text-on-tertiary font-semibold text-sm shadow hover:opacity-95 active:scale-95 transition-all"
            >
              <span>Explore Non-Tech Events</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>

        </div>
      </section>

      {/* Trending Spotlight Horizontal Carousel */}
      <section className="pt-6 pb-4 flex flex-col gap-3">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-filled text-tertiary text-[22px]">local_fire_department</span>
            <h3 className="font-headline font-bold text-lg sm:text-xl text-on-surface">Trending Spotlight</h3>
          </div>
          <span className="text-xs font-bold text-primary flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Capacity
          </span>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            <LoadingSkeleton count={2} />
          </div>
        )}

        {/* Scrollable Container */}
        {!loading && spotlightEvents.length > 0 && (
          <div className="flex gap-4 overflow-x-auto px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-3 pt-1 no-scrollbar">
            {spotlightEvents.map((evt) => {
              const isTech = evt.category === 'tech';
              const percent = Math.min(100, Math.round((evt.registered / evt.capacity) * 100));

              return (
                <div
                  key={evt.id}
                  onClick={() => onSelectEvent(evt)}
                  className="min-w-[270px] sm:min-w-[300px] max-w-[320px] rounded-2xl bg-surface-container-lowest p-4 shadow-sm border border-surface-container hover:shadow-md transition-all flex flex-col justify-between gap-3 shrink-0 cursor-pointer"
                >
                  <div className="flex flex-col gap-2.5">
                    <div className="relative h-32 w-full rounded-xl overflow-hidden bg-surface-container">
                      <img
                        src={evt.image}
                        alt={evt.title}
                        className="w-full h-full object-cover"
                      />
                      <span
                        className={`absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-white text-[11px] font-semibold shadow-xs ${
                          isTech ? 'bg-primary' : 'bg-tertiary'
                        }`}
                      >
                        {evt.track}
                      </span>
                      <span className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm text-emerald-800 text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Open
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-on-surface-variant text-[11px]">
                        <span className="material-symbols-outlined text-[14px]">event</span>
                        <span className="truncate">{evt.date} • {evt.venue.split('(')[0]}</span>
                      </div>
                      <h4 className="font-headline font-bold text-sm text-on-surface line-clamp-1">
                        {evt.title}
                      </h4>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {evt.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full bg-surface-container text-primary text-[10px] font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 pt-1 border-t border-surface-container/60">
                    <div className="flex justify-between text-xs text-on-surface-variant">
                      <span>Seats Filled</span>
                      <span className={`font-bold ${isTech ? 'text-primary' : 'text-tertiary'}`}>
                        {evt.registered} / {evt.capacity}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-surface-container overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isTech ? 'bg-primary' : 'bg-tertiary'}`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Eligibility & Branch Matrix Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pt-3 pb-8">
        <div className="rounded-2xl bg-surface-container p-5 sm:p-6 shadow-xs border border-surface-container-high flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[22px]">school</span>
            </div>
            <div className="flex flex-col">
              <h3 className="font-headline font-bold text-lg sm:text-xl text-on-surface">
                Open Across All Core Branches &amp; Study Years
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant">
                Every listed event specifies prerequisite eligibility criteria verified before pass generation.
              </p>
            </div>
          </div>

          {/* Departments */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">
              Eligible Engineering Departments
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {ALL_BRANCHES.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-lowest text-on-surface shadow-xs border border-surface-container-high/60"
                >
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0"></span>
                  <span className="text-xs font-semibold truncate">{b.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Years */}
          <div className="flex flex-col gap-2 pt-1">
            <span className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">
              Academic Years
            </span>
            <div className="grid grid-cols-4 gap-2">
              {ALL_YEARS.map((yr) => (
                <div
                  key={yr}
                  className="text-center py-2 rounded-xl bg-surface-container-lowest text-on-surface text-xs font-semibold shadow-xs border border-surface-container-high/60"
                >
                  {yr}
                </div>
              ))}
            </div>
          </div>

          {/* Info callout */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-container-lowest text-on-surface-variant text-xs border border-surface-container-high/60">
            <span className="material-symbols-outlined text-[18px] text-primary shrink-0">info</span>
            <p className="leading-snug">
              Note: Advanced workshops like the AI &amp; Machine Learning Lab require 2nd, 3rd, or 4th year standing. 1st year students have dedicated access to the Web Dev Bootcamp and Cultural Fests!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
