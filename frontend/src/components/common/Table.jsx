import React from 'react';

export function Table({ headers = [], children, emptyMessage = 'No records found.', variant = 'light', className = '' }) {
  const isDark = variant === 'dark';

  return (
    <div className={`w-full overflow-x-auto rounded-2xl shadow-xl transition-all duration-200 ${
      isDark
        ? 'border border-slate-800/80 bg-slate-900/90 backdrop-blur-md shadow-slate-950/50'
        : 'border border-slate-200 bg-white shadow-sm'
    } ${className}`}>
      <table className="w-full text-left text-sm">
        <thead className={`${
          isDark
            ? 'bg-slate-950/90 text-slate-400 border-b border-slate-800/80 font-bold uppercase text-[11px] tracking-wider'
            : 'bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase text-xs tracking-wider'
        }`}>
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} className="px-6 py-4">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={isDark ? 'divide-y divide-slate-800/60 text-slate-300' : 'divide-y divide-slate-100 text-slate-700'}>
          {children}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
