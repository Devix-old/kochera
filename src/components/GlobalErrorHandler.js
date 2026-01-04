'use client';

import { useEffect } from 'react';

/**
 * Global Error Handler Component
 * Catches all unhandled errors and promise rejections
 * This will help catch errors that ErrorBoundary might miss
 */
export default function GlobalErrorHandler() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return;
    }

    // Store original error handlers
    const originalError = window.onerror;
    const originalUnhandledRejection = window.onunhandledrejection;

    // Global error handler
    window.onerror = (message, source, lineno, colno, error) => {
      // Filter out non-fatal connection errors (from Vercel Analytics, Speed Insights, etc.)
      const errorMsg = (message || '').toString().toLowerCase();
      const errorSource = (source || '').toString().toLowerCase();
      const errorStack = (error && error.stack) ? error.stack.toString().toLowerCase() : '';
      
      // Comprehensive filtering for connection errors
      const isNonFatalError = 
        errorMsg.includes('connection closed') ||
        errorMsg.includes('websocket') ||
        errorMsg.includes('network error') ||
        errorMsg.includes('failed to fetch') ||
        errorSource.includes('_vercel') ||
        errorSource.includes('speed-insights') ||
        errorSource.includes('analytics') ||
        errorSource.includes('_next/static/chunks') ||
        errorStack.includes('connection closed') ||
        errorStack.includes('websocket') ||
        errorStack.includes('vercel') ||
        errorStack.includes('analytics') ||
        errorStack.includes('speed-insights');

      if (!isNonFatalError) {
        // Only log in development mode
        if (process.env.NODE_ENV === 'development') {
          console.error('Global Error Handler - onerror:', {
            message,
            source,
            lineno,
            colno,
            error,
            stack: error?.stack
          });
        }

        // Try to display error on page - only if body exists
        try {
          if (document.body) {
            // Remove existing error display if any
            const existing = document.getElementById('global-error-display');
            if (existing) existing.remove();
            
            const errorDiv = document.createElement('div');
            errorDiv.id = 'global-error-display';
            errorDiv.style.cssText = `
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              background: red;
              color: white;
              padding: 20px;
              z-index: 999999;
              font-family: monospace;
              font-size: 14px;
              max-height: 50vh;
              overflow-y: auto;
            `;
            errorDiv.innerHTML = `
              <h3 style="margin: 0 0 10px 0;">🚨 Global Error Caught:</h3>
              <p style="margin: 5px 0;"><strong>Message:</strong> ${message || 'Unknown error'}</p>
              <p style="margin: 5px 0;"><strong>Source:</strong> ${source || 'unknown'}</p>
              <p style="margin: 5px 0;"><strong>Line:</strong> ${lineno || '?'}:${colno || '?'}</p>
              ${error?.stack ? `<pre style="margin: 5px 0; white-space: pre-wrap;">${error.stack}</pre>` : ''}
            `;
            document.body.appendChild(errorDiv);
          }
        } catch (e) {
          // Silently handle display errors
        }
      } else {
        // Return true to prevent error from propagating
        return true;
      }

      // Call original handler if it exists
      if (originalError) {
        return originalError(message, source, lineno, colno, error);
      }
      return false;
    };

    // Unhandled promise rejection handler
    window.onunhandledrejection = (event) => {
      const error = event.reason;
      
      // Only log in development mode
      if (process.env.NODE_ENV === 'development') {
        console.error('Unhandled Promise Rejection:', error);
      }

      // Try to display error on page - only if body exists
      try {
        if (document.body) {
          // Remove existing error display if any
          const existing = document.getElementById('global-promise-error-display');
          if (existing) existing.remove();
          
          const errorDiv = document.createElement('div');
          errorDiv.id = 'global-promise-error-display';
          errorDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: orange;
            color: white;
            padding: 20px;
            z-index: 999998;
            font-family: monospace;
            font-size: 14px;
            max-height: 50vh;
            overflow-y: auto;
          `;
          errorDiv.innerHTML = `
            <h3 style="margin: 0 0 10px 0;">🚨 Unhandled Promise Rejection:</h3>
            <p style="margin: 5px 0;"><strong>Error:</strong> ${error?.toString() || 'Unknown error'}</p>
            ${error?.stack ? `<pre style="margin: 5px 0; white-space: pre-wrap;">${error.stack}</pre>` : ''}
          `;
          document.body.appendChild(errorDiv);
        }
      } catch (e) {
        // Silently handle display errors
      }

      // Call original handler if it exists
      if (originalUnhandledRejection) {
        originalUnhandledRejection(event);
      }
    };

    // Hydration error detection
    const checkHydrationErrors = () => {
      // Check for React hydration warnings in console
      const originalWarn = console.warn;
      console.warn = (...args) => {
        const message = args.join(' ');
        if (message.includes('hydration') || message.includes('Hydration') || message.includes('mismatch')) {
          // Only log in development mode
          if (process.env.NODE_ENV === 'development') {
            console.error('Hydration Error Detected:', ...args);
          }
          
          // Try to display on page - only if body exists
          try {
            if (document.body) {
              // Remove existing error display if any
              const existing = document.getElementById('hydration-error-display');
              if (existing) existing.remove();
              
              const errorDiv = document.createElement('div');
              errorDiv.id = 'hydration-error-display';
              errorDiv.style.cssText = `
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: purple;
                color: white;
                padding: 20px;
                z-index: 999997;
                font-family: monospace;
                font-size: 14px;
                max-height: 50vh;
                overflow-y: auto;
              `;
              errorDiv.innerHTML = `
                <h3 style="margin: 0 0 10px 0;">🚨 Hydration Error Detected:</h3>
                <pre style="margin: 5px 0; white-space: pre-wrap;">${message}</pre>
              `;
              document.body.appendChild(errorDiv);
            }
          } catch (e) {
            // Ignore
          }
        }
        originalWarn(...args);
      };
    };

    checkHydrationErrors();

    // Cleanup function
    return () => {
      window.onerror = originalError;
      window.onunhandledrejection = originalUnhandledRejection;
    };
  }, []);

  return null;
}
