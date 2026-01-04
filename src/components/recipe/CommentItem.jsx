'use client';

import { format } from 'date-fns';
import { User, Crown } from 'lucide-react';

// 10 beautiful, soft color combinations for avatars
const AVATAR_COLORS = [
  {
    bg: 'bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40',
    icon: 'text-purple-600 dark:text-purple-400',
    ring: 'ring-purple-100 dark:ring-purple-900/50',
  },
  {
    bg: 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40',
    icon: 'text-blue-600 dark:text-blue-400',
    ring: 'ring-blue-100 dark:ring-blue-900/50',
  },
  {
    bg: 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40',
    icon: 'text-green-600 dark:text-green-400',
    ring: 'ring-green-100 dark:ring-green-900/50',
  },
  {
    bg: 'bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/40 dark:to-pink-800/40',
    icon: 'text-pink-600 dark:text-pink-400',
    ring: 'ring-pink-100 dark:ring-pink-900/50',
  },
  {
    bg: 'bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-800/40',
    icon: 'text-indigo-600 dark:text-indigo-400',
    ring: 'ring-indigo-100 dark:ring-indigo-900/50',
  },
  {
    bg: 'bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40',
    icon: 'text-amber-600 dark:text-amber-400',
    ring: 'ring-amber-100 dark:ring-amber-900/50',
  },
  {
    bg: 'bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/40 dark:to-teal-800/40',
    icon: 'text-teal-600 dark:text-teal-400',
    ring: 'ring-teal-100 dark:ring-teal-900/50',
  },
  {
    bg: 'bg-gradient-to-br from-rose-100 to-rose-200 dark:from-rose-900/40 dark:to-rose-800/40',
    icon: 'text-rose-600 dark:text-rose-400',
    ring: 'ring-rose-100 dark:ring-rose-900/50',
  },
  {
    bg: 'bg-gradient-to-br from-cyan-100 to-cyan-200 dark:from-cyan-900/40 dark:to-cyan-800/40',
    icon: 'text-cyan-600 dark:text-cyan-400',
    ring: 'ring-cyan-100 dark:ring-cyan-900/50',
  },
  {
    bg: 'bg-gradient-to-br from-violet-100 to-violet-200 dark:from-violet-900/40 dark:to-violet-800/40',
    icon: 'text-violet-600 dark:text-violet-400',
    ring: 'ring-violet-100 dark:ring-violet-900/50',
  },
];

export default function CommentItem({ comment, colorIndex = 0 }) {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch {
      return dateString;
    }
  };

  // Get color based on index (cycles through 10 colors)
  const colorConfig = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length];
  const isAdmin = comment.is_admin;

  return (
    <div className={`mb-6 ${comment.parent_id ? 'ml-8 pl-4 border-l-2 border-purple-200 dark:border-purple-800' : ''}`} style={{ fontFamily: 'var(--font-lora)' }}>
      {/* Author name and date - outside the card, at the top */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className={`flex-shrink-0 w-9 h-9 rounded-full ${colorConfig.bg} flex items-center justify-center ring-2 ${colorConfig.ring}`}>
            {isAdmin ? (
              <Crown className={`w-4 h-4 ${colorConfig.icon}`} />
            ) : (
              <User className={`w-4 h-4 ${colorConfig.icon}`} />
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-900 dark:text-white text-sm">
              {comment.author_name}
            </span>
            {isAdmin && (
              <span className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800">
                ✨ Admin
              </span>
            )}
          </div>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formatDate(comment.created_at)}
        </span>
      </div>

      {/* Comment card */}
      <div className="bg-gradient-to-br from-gray-50 to-purple-50/30 dark:from-gray-900 dark:to-purple-950/20 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01]">
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">
          {comment.content}
        </p>
      </div>

      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 ml-4 space-y-4">
          {comment.replies.map((reply, replyIndex) => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              colorIndex={colorIndex + replyIndex + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
