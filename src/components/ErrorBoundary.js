'use client'; // essential for App Router
import React from 'react';
import Link from 'next/link';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Suppress non-fatal connection errors from Next.js chunks and analytics
    const errorMsg = (error?.message || '').toString().toLowerCase();
    const errorStack = (error?.stack || '').toString().toLowerCase();
    const isConnectionError = 
      errorMsg.includes('connection closed') ||
      errorMsg.includes('websocket') ||
      errorStack.includes('connection closed') ||
      errorStack.includes('_next/static/chunks');
    
    // Don't set hasError for connection errors - suppress them completely
    if (isConnectionError) {
      return { hasError: false, error: null };
    }
    
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Check if it's a connection error - suppress it
    const errorMsg = (error?.message || '').toString().toLowerCase();
    const errorStack = (error?.stack || '').toString().toLowerCase();
    const isConnectionError = 
      errorMsg.includes('connection closed') ||
      errorMsg.includes('websocket') ||
      errorStack.includes('connection closed') ||
      errorStack.includes('_next/static/chunks');
    
    if (isConnectionError) {
      // Suppress connection errors silently
      return;
    }
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    
    // Store error info for display
    this.setState({ errorInfo });
    
    // Send to error reporting service if available
    if (typeof window !== 'undefined' && window.gtag) {
      try {
        window.gtag('event', 'exception', {
          description: error.toString(),
          fatal: true
        });
      } catch (e) {
        // Ignore gtag errors
      }
    }
  }

  render() {
    if (this.state.hasError) {
      // User-friendly error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 dark:border-gray-700">
              <div className="w-24 h-24 mx-auto bg-gradient-to-r from-red-400 to-orange-500 rounded-full flex items-center justify-center mb-8">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Något gick fel
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Ett oväntat fel uppstod. Vi arbetar på att lösa problemet.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-left">
                  <p className="text-sm text-red-800 dark:text-red-200 font-mono">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    this.setState({ hasError: false, error: null, errorInfo: null });
                    window.location.reload();
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Ladda om sidan
                </button>
                <Link
                  href="/"
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Till startsidan
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
