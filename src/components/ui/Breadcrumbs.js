import Link from 'next/link';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export default function Breadcrumbs({ items, className }) {
  // Get the last item (recipe name) and parent items (category)
  const lastItem = items[items.length - 1];
  const parentItems = items.slice(0, -1);

  return (
    <nav aria-label="Brödsmulor" className={cn('w-full', className)}>
      {/* Desktop: Full breadcrumb in one line */}
      <div className="hidden md:flex items-center gap-2 text-sm font-semibold">
        <Link
          href="/"
          className="text-purple-600 hover:text-purple-700 transition-colors flex-shrink-0"
          aria-label="Startsida"
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

      {/* Mobile: Only arrow left + category */}
      <div className="md:hidden flex items-center gap-2 text-sm">
        {parentItems.length > 0 ? (
          <Link
            href={parentItems[0].url}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
            title={parentItems[0].name}
          >
            <ArrowLeft className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{parentItems[0].name}</span>
          </Link>
        ) : items.length > 0 && items[0].url ? (
          <Link
            href={items[0].url}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
            title={items[0].name}
          >
            <ArrowLeft className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{items[0].name}</span>
          </Link>
        ) : null}
      </div>
    </nav>
  );
}

