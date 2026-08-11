import React from 'react';

export function Card({ children, className = '', header, footer, ...props }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${className}`}
      {...props}
    >
      {header && (
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 font-bold text-slate-900 text-sm">
          {header}
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/70 text-xs text-slate-500 font-medium">
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;
