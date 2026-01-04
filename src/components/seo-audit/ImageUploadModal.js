'use client';

import { useState, useRef } from 'react';
import { X, Upload, Loader2, AlertCircle } from 'lucide-react';

export default function ImageUploadModal({ isOpen, onClose, oldImageSrc, onImageReplaced }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Extract old image name (without extension)
    const oldImagePath = oldImageSrc || '';
    const oldImageName = oldImagePath.split('/').pop() || '';
    const oldImageNameWithoutExt = oldImageName.replace(/\.[^/.]+$/, '');
    
    // Get new file extension
    const newExtension = file.name.split('.').pop().toLowerCase();
    
    // Create FormData
    const formData = new FormData();
    formData.append('image', file);
    formData.append('oldImageSrc', oldImageSrc || '');
    formData.append('oldImageName', oldImageNameWithoutExt);
    formData.append('newExtension', newExtension);

    setUploading(true);
    setError(null);

    try {
      const response = await fetch('/api/seo-optiz/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const data = await response.json();
      
      // Callback with new image path
      if (onImageReplaced) {
        onImageReplaced(data.newImagePath);
      }
      
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Replace Image</h2>
          <button
            onClick={onClose}
            disabled={uploading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {oldImageSrc && (
            <div className="mb-4 text-sm text-gray-600">
              <span className="font-medium">Current image:</span> {oldImageSrc.split('/').pop()}
              <br />
              <span className="text-xs text-gray-500">
                New image will be renamed to match the current name
              </span>
            </div>
          )}

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 bg-gray-50 hover:border-gray-400'
            } ${uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              disabled={uploading}
            />

            {uploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-700 font-medium">Uploading image...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-700 font-medium mb-2">
                  Drag and drop an image here
                </p>
                <p className="text-gray-500 text-sm">or click to browse</p>
                <p className="text-gray-400 text-xs mt-2">
                  Supports: JPG, PNG, WEBP, GIF
                </p>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={uploading}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

