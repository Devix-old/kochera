import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export default function Breadcrumbs({ items, className }) {

  return (
    <nav aria-label="Brödsmulor" className={cn('w-full', className)}>
      {/* Full breadcrumb - visible on all screen sizes */}
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Link
          href="/"
          className="text-purple-600 hover:text-purple-700 transition-colors flex-shrink-0"
          aria-label="Startseite"
        >
          <Home className="w-4 h-4" />
        </Link>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <div key={item.url || index} className="flex items-center gap-2 min-w-0">
              <ChevronRight className="w-4 h-4 text-purple-600 flex-shrink-0" />
              {isLast ? (
                <span 
                  className="font-medium truncate" 
                  style={{ color: '#3a3a3a' }}
                  aria-current="page"
                  title={item.name}
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="text-purple-600 hover:text-purple-700 transition-colors truncate flex-shrink-0"
                  title={item.name}
                >
                  {item.name}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}

