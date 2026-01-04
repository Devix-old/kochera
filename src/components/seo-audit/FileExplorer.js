'use client';

import { useState } from 'react';
import { Search, FileText, AlertCircle, AlertTriangle, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

export default function FileExplorer({ files, selectedFile, onSelectFile, searchQuery, onSearchChange }) {
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState('all'); // all, issues, warnings, missing-title, etc.
  const [sortBy, setSortBy] = useState('name'); // name, issues, title-length, excerpt-length

  const handleFileClick = (file) => {
    onSelectFile(file);
  };

  // Filter files
  let filteredFiles = files.filter(file => {
    if (!file) return false;
    
    const matchesSearch = 
      (file.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (file.filename || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (file.slug || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    // Apply filter type
    if (filterType === 'all') return true;
    if (filterType === 'issues') return file.hasIssues === true;
    if (filterType === 'warnings') return file.hasWarnings === true;
    if (filterType === 'problems') return file.hasIssues === true || file.hasWarnings === true;
    if (filterType === 'missing-title') return file.issues?.includes('missing-title') === true;
    if (filterType === 'missing-excerpt') return file.issues?.includes('missing-excerpt') === true;
    if (filterType === 'title-or-excerpt-length-error') return file.issues?.includes('title-or-excerpt-length-error') === true;
    if (filterType === 'missing-image-file') return file.issues?.includes('missing-image-file') === true;
    if (filterType === 'missing-slug') return file.issues?.includes('missing-slug') === true;
    if (filterType === 'missing-category') return file.issues?.includes('missing-category') === true;
    if (filterType === 'missing-dates') return file.issues?.includes('missing-publishedAt') === true || file.issues?.includes('missing-updatedAt') === true;
    
    return true;
  });

  // Sort files
  filteredFiles = [...filteredFiles].sort((a, b) => {
    if (!a || !b) return 0;
    if (sortBy === 'name') {
      return (a.title || '').localeCompare(b.title || '');
    } else if (sortBy === 'issues') {
      return (b.issueCount || 0) - (a.issueCount || 0);
    } else if (sortBy === 'title-length') {
      return (a.titleLength || 0) - (b.titleLength || 0);
    } else if (sortBy === 'excerpt-length') {
      return (a.excerptLength || 0) - (b.excerptLength || 0);
    }
    return 0;
  });

  // Count statistics
  const stats = {
    total: files.length,
    withIssues: files.filter(f => f?.hasIssues === true).length,
    withWarnings: files.filter(f => f?.hasWarnings === true).length,
    missingTitle: files.filter(f => f?.issues?.includes('missing-title')).length,
    missingExcerpt: files.filter(f => f?.issues?.includes('missing-excerpt')).length,
    lengthError: files.filter(f => f?.issues?.includes('title-or-excerpt-length-error')).length,
    missingImageFile: files.filter(f => f?.issues?.includes('missing-image-file')).length,
    missingSlug: files.filter(f => f?.issues?.includes('missing-slug')).length,
    missingCategory: files.filter(f => f?.issues?.includes('missing-category')).length,
    missingDates: files.filter(f => f?.issues?.includes('missing-publishedAt') || f?.issues?.includes('missing-updatedAt')).length,
    duplicateRecipeName: files.filter(f => f?.warnings?.includes('duplicate-recipe-name')).length,
  };

  const getIssueIcon = (file) => {
    if (!file) return null;
    if (file.hasIssues === true) {
      return <AlertCircle className="w-4 h-4 text-red-600" />;
    } else if (file.hasWarnings === true) {
      return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    }
    return null;
  };

  const getIssueBadge = (file) => {
    if (!file) return null;
    if ((file.issueCount || 0) > 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
          {file.issueCount} issue{file.issueCount !== 1 ? 's' : ''}
        </span>
      );
    } else if ((file.warningCount || 0) > 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
          {file.warningCount} warning{file.warningCount !== 1 ? 's' : ''}
        </span>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-gray-50 rounded">
            <div className="font-semibold text-gray-900">{stats.total}</div>
            <div className="text-gray-600">Total files</div>
          </div>
          <div className="p-2 bg-red-50 rounded">
            <div className="font-semibold text-red-900">{stats.withIssues}</div>
            <div className="text-red-600">With issues</div>
          </div>
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100"
        >
          <span className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters & Sort
          </span>
          {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {/* Filters */}
        {showFilters && (
          <div className="space-y-3 pt-2 border-t border-gray-200">
            {/* Filter Type */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Filter by:</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All files</option>
                <option value="problems">Has issues or warnings</option>
                <option value="issues">Has critical issues ({stats.withIssues})</option>
                <option value="warnings">Has warnings only ({stats.withWarnings})</option>
                <option value="missing-title">Missing title ({stats.missingTitle || 0})</option>
                <option value="missing-excerpt">Missing excerpt ({stats.missingExcerpt || 0})</option>
                <option value="title-or-excerpt-length-error">Title or excerpt length error ({stats.lengthError || 0})</option>
                <option value="missing-image-file">Missing image file ({stats.missingImageFile || 0})</option>
                <option value="missing-slug">Missing slug ({stats.missingSlug || 0})</option>
                <option value="missing-category">Missing category ({stats.missingCategory || 0})</option>
                <option value="missing-dates">Missing dates ({stats.missingDates || 0})</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Name (A-Z)</option>
                <option value="issues">Most issues first</option>
                <option value="title-length">Title length</option>
                <option value="excerpt-length">Excerpt length</option>
              </select>
            </div>

            {/* Active Filter Badge */}
            {filterType !== 'all' && (
              <button
                onClick={() => setFilterType('all')}
                className="w-full flex items-center justify-between px-2 py-1 text-xs text-blue-600 bg-blue-50 rounded"
              >
                <span>Clear filter</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
          Showing {filteredFiles.length} of {files.length} files
        </div>
      </div>
      
      {/* File List */}
      <div className="flex-1 overflow-y-auto">
        {filteredFiles.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No files found</p>
            {filterType !== 'all' && (
              <button
                onClick={() => setFilterType('all')}
                className="mt-2 text-xs text-blue-600 hover:text-blue-700"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredFiles.map((file, index) => (
              <button
                key={file?.slug || `file-${index}`}
                onClick={() => handleFileClick(file)}
                className={`w-full text-left p-3 hover:bg-gray-50 transition-colors ${
                  selectedFile?.slug === file?.slug ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                } ${file?.hasIssues === true ? 'bg-red-50/50' : file?.hasWarnings === true ? 'bg-yellow-50/50' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 truncate flex items-center gap-2">
                      {getIssueIcon(file)}
                      <span className="truncate">{file?.title || 'Untitled'}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 truncate">
                      {file?.directory || ''}/{file?.filename || ''}
                    </div>
                    {/* Quick stats */}
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      {(file?.titleLength || 0) > 0 && (
                        <span className={(file.titleLength || 0) < 50 || (file.titleLength || 0) > 60 ? 'text-red-600 font-medium' : ''}>
                          Title: {file.titleLength || 0} chars
                        </span>
                      )}
                      {(file?.excerptLength || 0) > 0 && (
                        <span className={(file.excerptLength || 0) < 150 || (file.excerptLength || 0) > 160 ? 'text-red-600 font-medium' : ''}>
                          Excerpt: {file.excerptLength || 0} chars
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {getIssueBadge(file)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
