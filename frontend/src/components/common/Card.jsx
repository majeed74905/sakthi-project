import React from 'react';

export function Card({ children, className = '', header, footer, ...props }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200/80 shadow-sm transition-all duration-200 overflow-hidden ${className}`} {...props}>
      {header && (
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          {header}
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500">
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;
