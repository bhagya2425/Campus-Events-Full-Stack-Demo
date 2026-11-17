import React, { useState } from 'react';

export default function DigitalPassModal({ passData, onClose, onGoHome }) {
  const [toastMessage, setToastMessage] = useState('');

  if (!passData) return null;

  const handleSavePass = () => {
    setToastMessage('Registration Pass saved to campus wallet & downloaded!');
    setTimeout(() => {
      setToastMessage('');
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-surface-bright rounded-2xl w-full max-w-md p-5 sm:p-6 shadow-2xl flex flex-col items-center text-center my-8 animate-in fade-in zoom-in-95 duration-200 border border-surface-container">
        
        {/* Celebratory Icon */}
        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-3 shadow-inner">
          <span className="material-symbols-filled text-[32px]">verified</span>
        </div>

        <h3 className="font-headline font-bold text-xl text-on-surface">
          Registration Successful!
        </h3>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-1 max-w-xs">
          Your registration has been confirmed. Your seat for <strong className="text-on-surface">{passData.eventTitle}</strong> is secured.
        </p>

        {/* Digital Pass Ticket Card */}
        <div className="w-full bg-surface-container-lowest rounded-xl p-4 shadow-sm my-4 text-left flex flex-col gap-3 relative overflow-hidden border border-surface-container">
          {/* Header strip */}
          <div className="flex items-center justify-between pb-2 bg-surface-container-low -mx-4 -mt-4 px-4 pt-3 mb-1 border-b border-surface-container">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-primary">confirmation_number</span>
              <span className="text-[11px] font-bold text-on-surface tracking-wider uppercase">
                Campus Access Pass
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              Active • Confirmed
            </span>
          </div>

          {/* Attendee Details */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-[11px] text-on-surface-variant font-medium">Delegate Name</span>
              <span className="text-sm font-bold text-on-surface">{passData.fullName}</span>
              <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                {passData.usn}
              </span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[11px] text-on-surface-variant font-medium">Pass ID</span>
              <span className="text-xs font-bold text-primary font-mono">{passData.passId}</span>
              <span className="text-xs text-on-surface-variant font-medium">
                {passData.branch} • {passData.year}
              </span>
            </div>
          </div>

          {/* Event & Location Strip */}
          <div className="bg-surface-container-low p-2.5 rounded-lg flex items-center gap-3 border border-surface-container/60">
            {/* Inline SVG QR representation */}
            <div className="w-14 h-14 bg-white p-1 rounded-md shrink-0 flex items-center justify-center shadow-xs border border-surface-container">
              <svg className="w-full h-full text-on-surface" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v2h-4v-2zm-4 0h2v4h-2v-4zm2 4h4v2h-4v-2zm2-2h2v2h-2v-2zm-6 2h2v2h-2v-2zm0-4h2v2h-2v-2zm-2-8h2v2h-2V6zm2 2h2v2h-2V8zm-2 2h2v2h-2v-2z"></path>
              </svg>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-on-surface truncate">{passData.venue}</span>
              <span className="text-[11px] text-on-surface-variant truncate">{passData.eventDate}</span>
              <span className="text-[10px] text-primary font-semibold mt-0.5">
                Scan barcode at entrance check-in desk
              </span>
            </div>
          </div>

          <div className="text-[10px] text-on-surface-variant/80 text-center">
            Issued to: {passData.email} • Mobile: {passData.phone}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col w-full gap-2 pt-1">
          <button
            onClick={handleSavePass}
            type="button"
            className="w-full h-11 bg-primary text-on-primary font-semibold text-xs sm:text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 active:scale-98 transition-all hover:bg-surface-tint"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Save Registration Pass
          </button>
          
          <button
            onClick={onGoHome}
            type="button"
            className="w-full h-11 bg-surface-container text-on-surface font-semibold text-xs sm:text-sm rounded-xl hover:bg-surface-container-high active:scale-98 transition-all"
          >
            Back to Campus Events Home
          </button>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-full text-xs sm:text-sm shadow-xl flex items-center gap-2 z-50 animate-in fade-in duration-200">
          <span className="material-symbols-outlined text-[18px] text-emerald-400">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
