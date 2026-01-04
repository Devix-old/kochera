import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

export default function Tag({ 
  children, 
  href, 
  variant = 'default',
  size = 'md',
  className 
}) {
  const baseClasses = 'inline-flex items-center rounded-full font-medium transition-colors';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
    primary: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200',
    accent: 'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const classes = cn(baseClasses, variants[variant], sizes[size], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return <span className={classes}>{children}</span>;
}

