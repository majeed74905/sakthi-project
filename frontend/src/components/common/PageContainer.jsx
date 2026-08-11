import React from 'react';

export function PageContainer({ title, subtitle, action, children, variant = 'light', className = '' }) {
  const isDark = variant === 'dark';

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
      {(title || subtitle || action) && (
        <div className={`flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-5 border-b gap-4 ${
          isDark ? 'border-slate-800/80' : 'border-slate-200/80'
        }`}>
          <div>
            {title && (
              <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {title}
              </h1>
            )}
            {subtitle && (
              <p className={`mt-1.5 text-sm font-medium leading-relaxed ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex items-center gap-3">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export default PageContainer;
