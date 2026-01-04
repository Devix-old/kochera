'use client';

import { useState, useEffect, useRef } from 'react';
import { Save, CheckCircle2, AlertCircle, XCircle, ChevronRight, ChevronLeft, Sparkles, FileText, Undo2, Circle } from 'lucide-react';
import CharCounter from './CharCounter';
import ImageReader from './ImageReader';

const STATUS_ICONS = {
  valid: <CheckCircle2 className="w-5 h-5 text-green-600" />,
  warning: <AlertCircle className="w-5 h-5 text-yellow-600" />,
  error: <XCircle className="w-5 h-5 text-red-600" />,
};

function FieldStatus({ isValid, hasWarning, isEmpty }) {
  if (isEmpty) return STATUS_ICONS.error;
  if (isValid === false) return STATUS_ICONS.error;
  if (hasWarning) return STATUS_ICONS.warning;
  return STATUS_ICONS.valid;
}

function SEOField({ label, value, onChange, min, max, placeholder, type = 'text', required = false }) {
  const isEmpty = !value || value.length === 0;
  const isValid = !required || (value && value.length >= (min || 0) && value.length <= (max || Infinity));
  // Only show warnings for invalid values, not for valid ones
  const hasWarning = false; // Disable warnings - if valid, show valid icon
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          {label}
          {required && <span className="text-red-500">*</span>}
          <FieldStatus isValid={isValid} hasWarning={hasWarning} isEmpty={isEmpty} />
        </label>
        {min && max && <CharCounter value={value} min={min} max={max} label="" />}
      </div>
      {type === 'textarea' ? (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      )}
    </div>
  );
}

export default function SEOAuditPanel({ file, onSave, onNext, onPrevious, hasNext, hasPrevious }) {
  const [frontmatter, setFrontmatter] = useState(file?.frontmatter || {});
  const [content, setContent] = useState(file?.content || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [showContent, setShowContent] = useState(false);
  
  // Track original state for change detection
  const originalState = useRef({ frontmatter: {}, content: '' });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (file) {
      const newFrontmatter = file.frontmatter || {};
      const newContent = file.content || '';
      setFrontmatter(newFrontmatter);
      setContent(newContent);
      originalState.current = {
        frontmatter: JSON.parse(JSON.stringify(newFrontmatter)),
        content: newContent
      };
      setHasChanges(false);
    }
  }, [file]);

  // Check for changes whenever frontmatter or content changes
  useEffect(() => {
    const current = { frontmatter, content };
    const isChanged = JSON.stringify(current.frontmatter) !== JSON.stringify(originalState.current.frontmatter) ||
                      current.content !== originalState.current.content;
    setHasChanges(isChanged);
  }, [frontmatter, content]);

  const updateField = (key, value) => {
    setFrontmatter(prev => {
      const updated = { ...prev, [key]: value };
      return updated;
    });
  };

  const updateImageSrc = (newSrc) => {
    setFrontmatter(prev => ({
      ...prev,
      image: {
        ...(prev.image || {}),
        src: newSrc,
        alt: prev.image?.alt || ''
      }
    }));
  };

  const handleUndo = () => {
    setFrontmatter(JSON.parse(JSON.stringify(originalState.current.frontmatter)));
    setContent(originalState.current.content);
    setHasChanges(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    
    try {
      const response = await fetch(`/api/seo-optiz/${file.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frontmatter, content }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save');
      }
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
      // Update original state after successful save
      originalState.current = {
        frontmatter: JSON.parse(JSON.stringify(frontmatter)),
        content: content
      };
      setHasChanges(false);
      onSave?.();
    } catch (error) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const generateOptimizedTitle = () => {
    const currentTitle = frontmatter.title || '';
    const length = currentTitle.length;
    
    if (length >= 50 && length <= 60) return currentTitle;
    
    if (length < 50) {
      // Add SEO-friendly words
      const additions = [' recept', ' – Klassisk favorit', ' – Perfekt för hela familjen'];
      return currentTitle + additions[0];
    } else {
      // Shorten intelligently
      return currentTitle.substring(0, 57) + '...';
    }
  };

  const generateOptimizedExcerpt = () => {
    const currentExcerpt = frontmatter.excerpt || '';
    const length = currentExcerpt.length;
    
    if (length >= 150 && length <= 160) return currentExcerpt;
    
    if (length < 150) {
      // Add descriptive text
      return currentExcerpt + ' Perfekt för hela familjen och enkel att laga.';
    } else {
      // Trim to fit
      return currentExcerpt.substring(0, 157) + '...';
    }
  };

  if (!file) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Select a file to audit</p>
        </div>
      </div>
    );
  }

  // Calculate SEO score
  const score = calculateSEOScore(frontmatter);
  
  // Check for missing fields
  const missingFields = [];
  if (!frontmatter.title) missingFields.push('title');
  if (!frontmatter.excerpt) missingFields.push('excerpt');
  if (!frontmatter.slug) missingFields.push('slug');
  if (!frontmatter.category) missingFields.push('category');
  if (!frontmatter.updatedAt) missingFields.push('updatedAt');
  if (!frontmatter.publishedAt) missingFields.push('publishedAt');

  // Get warnings from file object
  const warnings = file?.warnings || [];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{file.frontmatter?.title || file.slug}</h1>
              {hasChanges && (
                <span className="relative flex items-center">
                  <Circle className="w-2 h-2 fill-yellow-500 text-yellow-500 animate-pulse" />
                  <span className="ml-1 text-xs text-yellow-600 font-medium">Unsaved changes</span>
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">{file.directory}/{file.slug}.mdx</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onPrevious}
              disabled={!hasPrevious}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={onNext}
              disabled={!hasNext}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* SEO Score */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">SEO Score:</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${
                    score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${score}%` }}
                />
              </div>
              <span className="text-sm font-bold">{score}/100</span>
            </div>
          </div>
          {missingFields.length > 0 && (
            <div className="text-sm text-red-600">
              Missing: {missingFields.join(', ')}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Recipe Name */}
          <SEOField
            label="Recipe Name"
            value={frontmatter.recipeName}
            onChange={(val) => updateField('recipeName', val)}
            placeholder="Recipe name (display name)"
          />

          {/* Title */}
          <SEOField
            label="Title"
            value={frontmatter.title}
            onChange={(val) => updateField('title', val)}
            min={50}
            max={60}
            placeholder="Recipe title (50-60 characters)"
            required
          />
          <button
            onClick={() => updateField('title', generateOptimizedTitle())}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <Sparkles className="w-4 h-4" />
            Generate optimized title
          </button>

          {/* Excerpt */}
          <SEOField
            label="Excerpt / Description"
            value={frontmatter.excerpt}
            onChange={(val) => updateField('excerpt', val)}
            min={150}
            max={160}
            placeholder="Recipe description (150-160 characters)"
            type="textarea"
            required
          />
          <button
            onClick={() => updateField('excerpt', generateOptimizedExcerpt())}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <Sparkles className="w-4 h-4" />
            Generate optimized excerpt
          </button>

          {/* Slug */}
          <SEOField
            label="Slug"
            value={frontmatter.slug}
            onChange={(val) => updateField('slug', val)}
            placeholder="URL slug"
            required
          />

          {/* Category */}
          <SEOField
            label="Category"
            value={frontmatter.category}
            onChange={(val) => updateField('category', val)}
            placeholder="Recipe category"
            required
          />

          {/* Image */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              Image
              {(() => {
                const hasImageSrc = !!frontmatter.image?.src;
                const imageExists = file.imageMetadata?.exists === true;
                const imageNotExists = file.imageMetadata?.exists === false;
                
                // If no image src specified, show error
                if (!hasImageSrc) {
                  return <XCircle className="w-5 h-5 text-red-600" />;
                }
                
                // If imageMetadata explicitly says file doesn't exist, show error
                if (imageNotExists) {
                  return <XCircle className="w-5 h-5 text-red-600" />;
                }
                
                // If image src exists and (metadata confirms it exists OR metadata not loaded yet), show valid
                if (hasImageSrc && (imageExists || !file.imageMetadata)) {
                  return <CheckCircle2 className="w-5 h-5 text-green-600" />;
                }
                
                return null;
              })()}
            </label>
            <ImageReader
              imageSrc={frontmatter.image?.src}
              imageMetadata={file.imageMetadata}
              onImageChange={updateImageSrc}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                Published At
                <span className="text-red-500">*</span>
                {frontmatter.publishedAt ? STATUS_ICONS.valid : STATUS_ICONS.error}
              </label>
              <input
                type="datetime-local"
                value={frontmatter.publishedAt ? new Date(frontmatter.publishedAt).toISOString().slice(0, 16) : ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value).toISOString() : '';
                  updateField('publishedAt', date);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                Updated At
                <span className="text-red-500">*</span>
                {frontmatter.updatedAt ? STATUS_ICONS.valid : STATUS_ICONS.error}
              </label>
              <input
                type="datetime-local"
                value={frontmatter.updatedAt ? new Date(frontmatter.updatedAt).toISOString().slice(0, 16) : ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value).toISOString() : '';
                  updateField('updatedAt', date);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tags</label>
            <input
              type="text"
              value={Array.isArray(frontmatter.tags) ? frontmatter.tags.join(', ') : ''}
              onChange={(e) => updateField('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
              placeholder="Comma-separated tags"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Warnings Section */}
          {warnings.length > 0 && (
            <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <h3 className="text-sm font-medium text-yellow-900">Warnings</h3>
              </div>
              <ul className="space-y-1 text-sm text-yellow-800">
                {warnings.map((warning, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-600"></span>
                    {warning === 'duplicate-recipe-name' && (
                      <span>Duplicate recipe name: &quot;{frontmatter.recipeName}&quot; (another recipe uses this name)</span>
                    )}
                    {warning === 'no-tags' && (
                      <span>No tags specified</span>
                    )}
                    {warning === 'no-author' && (
                      <span>No author specified</span>
                    )}
                    {warning === 'no-hero-image' && (
                      <span>No hero image specified</span>
                    )}
                    {!['duplicate-recipe-name', 'no-tags', 'no-author', 'no-hero-image'].includes(warning) && (
                      <span>{warning}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* MDX Content Preview */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => setShowContent(!showContent)}
              className="w-full px-4 py-2 text-left font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-between"
            >
              <span>MDX Content Preview</span>
              <ChevronRight className={`w-5 h-5 transition-transform ${showContent ? 'rotate-90' : ''}`} />
            </button>
            {showContent && (
              <div className="p-4 border-t border-gray-200">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              {saveStatus === 'success' && (
                <span className="text-green-600 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Saved successfully!
                </span>
              )}
              {saveStatus === 'error' && (
                <span className="text-red-600">Error saving file</span>
              )}
            </div>
            {hasChanges && (
              <button
                onClick={handleUndo}
                className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Undo2 className="w-4 h-4" />
                Undo Changes
              </button>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function calculateSEOScore(frontmatter) {
  let score = 0;
  const maxScore = 100;
  
  // Title (20 points)
  if (frontmatter.title) {
    const titleLen = frontmatter.title.length;
    if (titleLen >= 50 && titleLen <= 60) score += 20;
    else if (titleLen >= 40 && titleLen <= 70) score += 10;
    else score += 5;
  }
  
  // Excerpt (20 points)
  if (frontmatter.excerpt) {
    const excerptLen = frontmatter.excerpt.length;
    if (excerptLen >= 150 && excerptLen <= 160) score += 20;
    else if (excerptLen >= 120 && excerptLen <= 180) score += 10;
    else score += 5;
  }
  
  // Required fields (40 points)
  if (frontmatter.slug) score += 10;
  if (frontmatter.category) score += 10;
  if (frontmatter.publishedAt) score += 10;
  if (frontmatter.updatedAt) score += 10;
  
  // Optional but valuable fields (20 points)
  if (frontmatter.tags && frontmatter.tags.length > 0) score += 5;
  if (frontmatter.image) score += 5;
  if (frontmatter.author) score += 5;
  if (frontmatter.difficulty) score += 5;
  
  return Math.min(score, maxScore);
}

