import React from 'react';

export default function Header({ activeScreen, setActiveScreen, selectedEvent, onBack }) {
  const isStackScreen = activeScreen === 'event-details' || activeScreen === 'registration';

  return (
    <header className="fixed top-0 w-full z-40 pt-safe bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container">
      <div className="max-w-7xl mx-auto h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Left: Brand Identity / Back Action */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {isStackScreen ? (
            <button
              onClick={onBack}
              aria-label="Go back"
              className="w-11 h-11 -ml-1 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container active:scale-95 transition-all shrink-0"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          ) : (
            <div
              onClick={() => setActiveScreen('home')}
              className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary shadow-sm shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-[22px]">school</span>
            </div>
          )}

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span 
                onClick={() => setActiveScreen('home')}
                className="font-headline font-bold text-lg text-on-surface truncate cursor-pointer hover:text-primary transition-colors"
              >
                Campus Events
              </span>
              <span className="hidden sm:inline-block text-xs text-on-surface-variant font-normal opacity-70">|</span>
              <span className="hidden sm:inline-block text-xs font-semibold text-primary truncate">
                {activeScreen === 'home' && 'Home'}
                {activeScreen === 'tech' && 'Tech Track'}
                {activeScreen === 'non-tech' && 'Non-Tech Track'}
                {activeScreen === 'about' && 'About Portal'}
                {activeScreen === 'event-details' && (selectedEvent?.title || 'Details')}
                {activeScreen === 'registration' && 'Registration Checkout'}
              </span>
            </div>
            <div className="flex items-center gap-1 overflow-hidden">
              <span className="material-symbols-outlined text-[13px] text-primary shrink-0">verified</span>
              <span className="text-[11px] text-primary font-bold truncate max-w-[210px] xs:max-w-[280px] sm:max-w-none">
                All Branches (CSE, AI/ML, DS, IoT, ECE, ISE)
              </span>
            </div>
          </div>
        </div>

        {/* Center: Desktop Navigation Bar */}
        <nav className="hidden md:flex items-center gap-1 bg-surface-container/70 p-1 rounded-full border border-surface-container-high">
          <button
            onClick={() => setActiveScreen('home')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeScreen === 'home'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveScreen('tech')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeScreen === 'tech'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            Tech Events
          </button>
          <button
            onClick={() => setActiveScreen('non-tech')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeScreen === 'non-tech'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            Non-Tech Events
          </button>
          <button
            onClick={() => setActiveScreen('about')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeScreen === 'about'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            About & Guidelines
          </button>
        </nav>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setActiveScreen('tech')}
            aria-label="Search portal"
            title="Search events"
            className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>

          <button
            onClick={() => alert('Campus Notification: Fall Fest & Tech registrations are actively open for all engineering batches.')}
            aria-label="Notifications"
            title="Notifications"
            className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container active:scale-95 transition-all relative"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-tertiary-container ring-2 ring-surface"></span>
          </button>

          <div
            title="Student Profile"
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ml-1 shrink-0 shadow-sm text-on-primary"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
}
