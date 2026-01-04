'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) {
  if (totalPages <= 1) return null;

  const pages = [];
  const showEllipsis = totalPages > 7;

  if (showEllipsis) {
    // Always show first page
    pages.push(1);

    if (currentPage > 3) {
      pages.push('...');
    }

    // Show pages around current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    // Always show last page
    pages.push(totalPages);
  } else {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  }

  return (
    <nav
      role="navigation"
      aria-label="Paginering"
      className={cn('flex items-center justify-center gap-2', className)}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Föregående sida"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {pages.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              'min-w-[40px] px-3 py-2 rounded-lg font-medium transition-colors',
              currentPage === page
                ? 'bg-purple-600 text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
            )}
            aria-label={`Sida ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Nästa sida"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </nav>
  );
}

