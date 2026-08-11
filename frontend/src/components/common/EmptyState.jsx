import React from 'react';
import { Inbox } from 'lucide-react';

export function EmptyState({ title = 'No Data Available', description = 'There are no items to display at this time.', action }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 my-4">
      <div className="p-3 bg-white rounded-full shadow-sm mb-3 text-slate-400">
        <Inbox className="w-8 h-8" />
      </div>
      <h4 className="text-base font-semibold text-slate-800 mb-1">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mb-4">{description}</p>
      {action}
    </div>
  );
}

export default EmptyState;
