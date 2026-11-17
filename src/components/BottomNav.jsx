import React from 'react';

export default function BottomNav({ activeScreen, setActiveScreen }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'tech', label: 'Tech', icon: 'code' },
    { id: 'non-tech', label: 'Non-Tech', icon: 'palette' },
    { id: 'about', label: 'About', icon: 'info' }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-40 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-1px_12px_rgba(0,0,0,0.06)] border-t border-surface-container">
      <div className="flex justify-around items-center h-16 px-2">
        {tabs.map((tab) => {
          const isActive = activeScreen === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveScreen(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[64px] h-12 active:scale-95 transition-all gap-0.5 ${
                isActive ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className={`material-symbols-outlined text-[22px] ${isActive ? 'font-bold' : ''}`}>
                {tab.icon}
              </span>
              <span className="text-[11px] leading-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
