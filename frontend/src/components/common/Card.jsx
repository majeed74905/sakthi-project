import React from 'react';

export function Card({ children, className = '', header, footer, variant = 'light', ...props }) {
  const isDark = variant === 'dark';

  return (
    <div
      className={`rounded-2xl transition-all duration-200 overflow-hidden ${
        isDark
          ? 'bg-slate-900/90 border border-slate-800/80 shadow-xl shadow-slate-950/40 text-slate-100 backdrop-blur-md'
          : 'bg-white rounded-xl border border-slate-200/80 shadow-sm'
      } ${className}`}
      {...props}
    >
      {header && (
        <div
          className={`px-6 py-4 border-b ${
            isDark ? 'border-slate-800/80 bg-slate-950/60 text-white font-bold' : 'border-slate-100 bg-slate-50/50'
          }`}
        >
          {header}
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div
          className={`px-6 py-3 border-t text-xs ${
            isDark ? 'border-slate-800/80 bg-slate-950/60 text-slate-400' : 'border-slate-100 bg-slate-50/50 text-slate-500'
          }`}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;
