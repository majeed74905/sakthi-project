import React from 'react';

export function Table({ headers = [], children, emptyMessage = 'No records found.', className = '' }) {
  return (
    <div className={`w-full overflow-x-auto rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-200 overflow-hidden ${className}`}>
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50/90 text-slate-600 border-b border-slate-200 font-bold uppercase text-[11px] tracking-wider">
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} className="px-6 py-4">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
          {children}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
