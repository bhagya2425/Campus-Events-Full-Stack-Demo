import React from 'react';

export function LoadingSkeleton({ count = 2 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-xs border border-surface-container/60 flex flex-col"
        >
          {/* Skeleton image */}
          <div className="w-full h-44 sm:h-48 bg-surface-container-high/80 relative">
            <div className="absolute top-3 left-3 w-28 h-6 rounded-full bg-surface-container"></div>
            <div className="absolute top-3 right-3 w-20 h-6 rounded-full bg-surface-container"></div>
          </div>
          {/* Skeleton body */}
          <div className="p-5 flex flex-col gap-3">
            <div className="w-3/4 h-5 rounded bg-surface-container"></div>
            <div className="w-1/2 h-3.5 rounded bg-surface-container-high"></div>
            <div className="w-full h-12 rounded-xl bg-surface-container-low mt-2"></div>
            <div className="flex gap-2 pt-2">
              <div className="w-16 h-5 rounded-full bg-surface-container"></div>
              <div className="w-20 h-5 rounded-full bg-surface-container"></div>
            </div>
            <div className="w-full h-10 rounded-xl bg-surface-container-high mt-3"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ErrorState({ error, onRetry, onUseFallback }) {
  const isPermissionDenied = error?.code === '42501' || (error?.message || '').toLowerCase().includes('permission denied');

  return (
    <div className="my-6 p-5 sm:p-6 rounded-2xl bg-error-container/40 border border-error/30 text-on-surface flex flex-col gap-3 shadow-xs">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-error text-white flex items-center justify-center shrink-0 shadow-xs">
          <span className="material-symbols-outlined text-[24px]">error</span>
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <h3 className="font-headline font-bold text-base sm:text-lg text-error">
            Failed to Load Events from Supabase
          </h3>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5 font-mono">
            {error?.message || 'Network error connecting to Supabase database.'}
          </p>

          {isPermissionDenied && (
            <div className="mt-3 p-3 rounded-xl bg-surface-container-lowest text-xs text-on-surface border border-surface-container">
              <strong className="text-primary block mb-1">💡 Supabase Permission Action Required:</strong>
              <span>
                Row Level Security (RLS) is enabled or SELECT permission is not granted on <code className="bg-surface-container px-1 py-0.5 rounded font-mono">public.events</code>.
                In your Supabase SQL Editor or Table Settings, grant access to anon:
              </span>
              <pre className="mt-2 p-2 rounded bg-surface-container-high font-mono text-[11px] overflow-x-auto text-primary">
                GRANT SELECT ON public.events TO anon;
              </pre>
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2.5">
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs sm:text-sm font-semibold active:scale-95 transition-all shadow-xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">refresh</span>
                <span>Retry Connection</span>
              </button>
            )}

            {onUseFallback && (
              <button
                onClick={onUseFallback}
                className="px-4 py-2 rounded-xl bg-surface-container text-on-surface text-xs sm:text-sm font-semibold hover:bg-surface-container-high active:scale-95 transition-all flex items-center gap-1.5 border border-surface-container-high"
              >
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                <span>View Offline Sample Events</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
