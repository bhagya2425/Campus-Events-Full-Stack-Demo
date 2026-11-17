import React from 'react';
import { ALL_BRANCHES } from '../data/eventsData';

export default function AboutPage({ setActiveScreen }) {
  const faqs = [
    {
      q: 'Who can register for Campus Events?',
      a: 'All bona fide engineering students currently enrolled in approved departments (CSE, AI/ML, Data Science, IoT, ECE, and ISE) across 1st, 2nd, 3rd, and 4th academic years. Specific advanced workshops outline prerequisite years.'
    },
    {
      q: 'Are all campus events free of cost?',
      a: 'Yes! All featured workshops, cultural fests, and hackathons are fully sponsored by student club allocations and departmental grants. Digital passes are generated without any checkout fees.'
    },
    {
      q: 'How does the entry pass check-in work?',
      a: 'Upon registering, a unique digital pass (#EVT-2025-XXXX) containing an encrypted barcode/QR stamp is created. Display this digital pass alongside your physical College ID card at the venue security desk.'
    },
    {
      q: 'Can 1st year students attend tech events?',
      a: 'Yes, 1st year students are welcome to participate in the Web Development Bootcamp and competitive coding arenas. Only select specialized machine learning labs require sophomore standing or above.'
    }
  ];

  return (
    <div className="flex flex-col w-full pb-20 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Breadcrumb Header */}
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
          <span className="text-primary font-bold">About Portal</span>
        </div>

        <div className="mt-1 flex flex-col gap-1">
          <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-on-surface tracking-tight">
            About Campus Events Portal
          </h1>
          <p className="text-sm text-on-surface-variant max-w-2xl">
            The unified digital platform bridging student curiosity, technological velocity, and collegiate cultural heritage.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Portal Mission Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-xs border border-surface-container space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">hub</span>
            </div>
            <div>
              <h2 className="font-headline font-bold text-base sm:text-lg text-on-surface">
                Single Window Discovery
              </h2>
              <span className="text-xs text-primary font-semibold">CampusPulse Design Framework</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Campus Events centralizes every departmental competition, lab seminar, cultural stage, and hackathon into an intuitive mobile-first experience. Our real-time capacity monitoring ensures fair seat allocation while protecting high-demand laboratory benches.
          </p>
        </div>

        {/* Accredited Branches */}
        <div className="bg-surface-container rounded-2xl p-5 sm:p-6 shadow-xs border border-surface-container-high space-y-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">verified</span>
            <h3 className="font-headline font-bold text-base sm:text-lg text-on-surface">
              Accredited Departments
            </h3>
          </div>
          <p className="text-xs text-on-surface-variant">
            Official event credits and certificates are formally recognized across the following departments:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {ALL_BRANCHES.map((b) => (
              <div
                key={b.id}
                className="p-3 rounded-xl bg-surface-container-lowest text-on-surface flex items-center gap-2.5 shadow-xs border border-surface-container-high/60"
              >
                <span className="w-2 h-2 rounded-full bg-primary shrink-0"></span>
                <span className="text-xs font-semibold">{b.fullName}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-xs border border-surface-container space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">help_center</span>
            <h3 className="font-headline font-bold text-base sm:text-lg text-on-surface">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container/60 space-y-1">
                <h4 className="text-xs sm:text-sm font-bold text-on-surface flex items-center gap-2">
                  <span className="text-primary font-mono text-xs">Q{idx + 1}.</span>
                  {faq.q}
                </h4>
                <p className="text-xs text-on-surface-variant pl-5 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Help & Directorate Office */}
        <div className="p-5 rounded-2xl bg-surface-container-low border border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-on-surface">Directorate of Student Welfare</h4>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Room 101, Student Activity Center (SAC) • studentwelfare@campus.edu
            </p>
          </div>
          <button
            onClick={() => setActiveScreen('home')}
            className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold shadow-xs hover:bg-surface-tint active:scale-95 transition-all shrink-0"
          >
            Explore Active Events
          </button>
        </div>
      </div>
    </div>
  );
}
