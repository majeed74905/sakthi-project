import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './Button';

export function ErrorState({ title = 'Something went wrong', message = 'An error occurred while loading data. Please try again.', onRetry }) {
  return (
    <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl text-center my-4">
      <div className="inline-flex p-3 bg-rose-100 rounded-full text-rose-600 mb-3">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-bold text-rose-900 mb-1">{title}</h4>
      <p className="text-xs text-rose-700 max-w-md mx-auto mb-4">{message}</p>
      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}

export default ErrorState;
