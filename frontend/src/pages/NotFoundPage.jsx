import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { FileQuestion, Home } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mx-auto border border-rose-500/20">
          <FileQuestion className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-6xl font-black text-white tracking-tight">404</h1>
          <h3 className="text-lg font-bold text-slate-300 mt-2">Page Not Found</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            The route you requested does not exist or has been moved.
          </p>
        </div>
        <Link to="/" className="inline-block w-full">
          <Button variant="accent" className="w-full font-bold">
            <Home className="w-4 h-4 mr-2" /> Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
