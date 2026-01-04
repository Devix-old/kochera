'use client';

import Link from 'next/link';
import { Calendar, Clock, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import Tag from '../ui/Tag';
import { cn } from '@/lib/utils/cn';

export default function BlogCard({ blog, index = 0, className, sizes = "(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw" }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getReadingTime = (content) => {
    if (!content) return 5;
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const readingTime = getReadingTime(blog.content || blog.excerpt);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        'group bg-white dark:bg-gray-800 overflow-hidden transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-lg rounded-lg',
        className
      )}
    >
      <Link href={`/blogg/${blog.slug}`} className="block">
        <div className="relative overflow-hidden bg-gray-200 dark:bg-gray-700">
          {blog.image?.src ? (
            <img
              src={blog.image.src}
              alt={blog.image.alt || blog.title}
              width="400"
              height="300"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
              <BookOpen className="w-16 h-16 text-purple-400 dark:text-purple-500" />
            </div>
          )}
          {blog.category && (
            <div className="absolute top-3 left-3">
              <Tag variant="accent" size="sm">
                {blog.category}
              </Tag>
            </div>
          )}
        </div>

        <div className="p-4 md:p-6">
          <h3 
            className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2"
            style={{ 
              fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
              letterSpacing: '-0.01em',
              fontWeight: 700
            }}
          >
            {blog.title}
          </h3>

          {blog.excerpt && (
            <p 
              className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {blog.excerpt}
            </p>
          )}

          <div className="flex items-center gap-3 text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-4">
            {blog.publishedAt && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                <span>{formatDate(blog.publishedAt)}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 md:w-4 md:h-4" />
              <span>{readingTime} min läsning</span>
            </div>
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {blog.tags.slice(0, 3).map((tag) => (
                <Tag key={tag} size="sm">
                  {tag}
                </Tag>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
}









