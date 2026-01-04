'use client';

import { useState, useEffect, useCallback } from 'react';
import { Image as ImageIcon, RefreshCw, AlertCircle } from 'lucide-react';
import ImageUploadModal from './ImageUploadModal';

export default function ImageReader({ imageSrc, imageMetadata, onImageChange }) {
  const [imageInfo, setImageInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const loadImageInfo = useCallback(async (src) => {
    setLoading(true);
    setError(null);
    
    try {
      // Create an image element to get dimensions
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const ratio = (img.width / img.height).toFixed(2);
        setImageInfo({
          width: img.width,
          height: img.height,
          ratio: ratio,
          size: imageMetadata?.size || null,
          sizeFormatted: imageMetadata?.sizeFormatted || null,
          name: imageMetadata?.name || src.split('/').pop(),
          src: src,
        });
        setLoading(false);
      };
      
      img.onerror = () => {
        setError('Failed to load image');
        setImageInfo(null);
        setLoading(false);
      };
      
      img.src = src.startsWith('/') ? src : `/${src}`;
    } catch (err) {
      setError(err.message);
      setImageInfo(null);
      setLoading(false);
    }
  }, [imageMetadata?.name, imageMetadata?.size, imageMetadata?.sizeFormatted]);

  useEffect(() => {
    if (imageSrc) {
      loadImageInfo(imageSrc);
    } else {
      setImageInfo(null);
    }
  }, [imageSrc, loadImageInfo]);

  if (!imageSrc && !imageMetadata) {
    return (
      <div className="text-sm text-gray-500 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-red-500" />
        <span>No image specified</span>
      </div>
    );
  }

  // Only show error if imageMetadata explicitly says file doesn't exist
  // Don't show error from loading failures (might be network issue)
  if (imageMetadata && imageMetadata.exists === false) {
    return (
      <div className="border border-red-200 bg-red-50 rounded-lg p-3">
        <div className="flex items-center gap-2 text-red-700 mb-2">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Image file not found</span>
        </div>
        {imageMetadata?.name && (
          <div className="text-xs text-red-600">Expected: {imageMetadata.name}</div>
        )}
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
      <div className="flex items-start gap-3">
        {/* Image Preview */}
        {imageSrc && (
          <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden border border-gray-300 bg-white">
            <img
              src={imageSrc.startsWith('/') ? imageSrc : `/${imageSrc}`}
              alt="Recipe image"
              width="80"
              height="80"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        )}
        
        {/* Image Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 truncate">
              {imageInfo?.name || imageMetadata?.name || 'Image'}
            </span>
          </div>
          
          {loading ? (
            <div className="text-xs text-gray-500">Loading image info...</div>
          ) : imageInfo ? (
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex items-center gap-4">
                <span>Size: {imageInfo.width} × {imageInfo.height}px</span>
                <span>Ratio: {imageInfo.ratio}:1</span>
              </div>
              {imageInfo.sizeFormatted && (
                <div>File size: {imageInfo.sizeFormatted}</div>
              )}
              <div className="text-gray-500 truncate">{imageInfo.src}</div>
            </div>
          ) : imageMetadata ? (
            <div className="space-y-1 text-xs text-gray-600">
              {imageMetadata.sizeFormatted && (
                <div>File size: {imageMetadata.sizeFormatted}</div>
              )}
              <div className="text-gray-500 truncate">{imageMetadata.src}</div>
            </div>
          ) : null}
          
          {/* Replace Image Button */}
          {onImageChange && (
            <>
              <button
                onClick={() => setShowUploadModal(true)}
                className="mt-2 text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Replace image
              </button>
              
              <ImageUploadModal
                isOpen={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                oldImageSrc={imageSrc}
                onImageReplaced={(newImagePath) => {
                  // Update image src in parent component
                  if (onImageChange) {
                    onImageChange(newImagePath);
                  }
                  // Update local state and reload image info
                  if (newImagePath) {
                    setTimeout(() => {
                      loadImageInfo(newImagePath);
                    }, 100);
                  }
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

