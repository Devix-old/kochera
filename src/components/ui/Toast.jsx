'use client';

import { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', isVisible, onClose, duration = 3000 }) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
  };

  const styles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div className={`${styles[type]} rounded-lg shadow-2xl px-6 py-4 flex items-center gap-3 max-w-md`}>
        {icons[type]}
        <span className="font-medium flex-1">{message}</span>
        <button
          onClick={onClose}
          className="hover:opacity-80 transition-opacity"
          aria-label="Stäng"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

