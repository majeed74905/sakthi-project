import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ message = 'Loading...', size = 'md' }) {
  const sizeMap = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <Loader2 className={`${sizeMap[size]} text-brand-600 animate-spin mb-3`} />
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
}

export default LoadingSpinner;
