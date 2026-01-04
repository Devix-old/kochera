'use client';

import { formatDistanceToNow } from 'date-fns';
import { sv } from 'date-fns/locale/sv';
import { useState } from 'react';
import { Trash2, Check, Clock, AlertTriangle } from 'lucide-react';

export default function AdminCommentItem({ comment, onUpdateStatus, onDelete }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(comment.status);

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: sv,
      });
    } catch {
      return new Date(dateString).toLocaleString('sv-SE');
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (currentStatus === newStatus || isUpdating) return;
    
    setIsUpdating(true);
    // Optimistic update
    setCurrentStatus(newStatus);

    try {
      await onUpdateStatus(comment.id, newStatus);
    } catch (error) {
      // Rollback on error
      setCurrentStatus(comment.status);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsUpdating(true);
    try {
      await onDelete(comment.id);
    } catch (error) {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: {
        icon: <Clock className="w-3 h-3" />,
        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        label: 'Väntar'
      },
      approved: {
        icon: <Check className="w-3 h-3" />,
        className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        label: 'Godkänd'
      },
      spam: {
        icon: <AlertTriangle className="w-3 h-3" />,
        className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        label: 'Spam'
      }
    };

    const { icon, className, label } = config[status];

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${className} transition-all duration-200`}>
        {icon}
        {label}
      </span>
    );
  };

  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 transition-all duration-300 hover:shadow-lg ${
      isUpdating ? 'opacity-50 pointer-events-none' : ''
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="font-semibold text-gray-900 dark:text-white text-lg">
              {comment.author_name}
            </span>
            {comment.is_admin && (
              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                Admin
              </span>
            )}
            {getStatusBadge(currentStatus)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-x-2">
            <span>{comment.author_email || 'Ingen e-post'}</span>
            <span>•</span>
            <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{comment.page_slug}</span>
            <span>•</span>
            <span>{formatDate(comment.created_at)}</span>
          </div>
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-5 leading-relaxed">
        {comment.content}
      </p>

      {comment.parent_id && (
        <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-400 dark:border-purple-600 rounded text-sm text-purple-700 dark:text-purple-300">
          💬 Svar på kommentar ID: {comment.parent_id}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleStatusChange('approved')}
          disabled={isUpdating || currentStatus === 'approved'}
          className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 flex items-center gap-2 ${
            currentStatus === 'approved'
              ? 'bg-green-500 text-white cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-md transform hover:scale-105 active:scale-95'
          }`}
          title={currentStatus === 'approved' ? 'Redan godkänd' : 'Godkänn denna kommentar'}
        >
          <Check className="w-4 h-4" />
          {currentStatus === 'approved' ? 'Godkänd' : 'Godkänn'}
        </button>

        {currentStatus !== 'pending' && (
          <button
            onClick={() => handleStatusChange('pending')}
            disabled={isUpdating}
            className="px-4 py-2 text-sm bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 hover:shadow-md transform hover:scale-105 active:scale-95"
          >
            <Clock className="w-4 h-4" />
            Markera som väntande
          </button>
        )}

        {currentStatus !== 'spam' && (
          <button
            onClick={() => handleStatusChange('spam')}
            disabled={isUpdating}
            className="px-4 py-2 text-sm bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 hover:shadow-md transform hover:scale-105 active:scale-95"
          >
            <AlertTriangle className="w-4 h-4" />
            Markera som spam
          </button>
        )}

        <button
          onClick={handleDelete}
          disabled={isUpdating}
          className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 ml-auto hover:shadow-md transform hover:scale-105 active:scale-95"
        >
          <Trash2 className="w-4 h-4" />
          Radera
        </button>
      </div>
    </div>
  );
}
