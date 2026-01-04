'use client';

import { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

export default function SuccessModal({ isOpen, onClose, message, autoCloseDelay = 4000 }) {
  useEffect(() => {
    if (isOpen && autoCloseDelay > 0) {
      const timer = setTimeout(onClose, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, autoCloseDelay]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Stäng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success icon */}
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full">
          <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>

        {/* Message */}
        <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-2">
          Kommentaren skickades!
        </h3>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          {message}
        </p>

        {/* Action button */}
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          OK
        </button>
      </div>
    </div>
  );
}

