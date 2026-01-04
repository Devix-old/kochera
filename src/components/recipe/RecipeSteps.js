'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Clock, Lightbulb, Check, ZoomIn, X } from 'lucide-react';

export default function RecipeSteps({ steps }) {
  const [completedSteps, setCompletedSteps] = useState({});
  const [expandedMedia, setExpandedMedia] = useState(null);
  const pathname = usePathname();

  // Handle scroll to step when hash is present in URL
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash && hash.startsWith('#step-')) {
      const stepNumber = hash.replace('#step-', '');
      const stepIndex = parseInt(stepNumber, 10) - 1; // Convert to 0-based index
      
      if (!isNaN(stepIndex) && stepIndex >= 0 && stepIndex < steps.length) {
        // Small delay to ensure DOM is ready
        const scrollTimer = setTimeout(() => {
          const stepElement = document.getElementById(`step-${stepNumber}`);
          if (stepElement) {
            // Calculate offset for fixed headers (if any)
            const headerOffset = 80; // Adjust based on your header height
            const elementPosition = stepElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth',
            });

            // Add a highlight effect to the step
            stepElement.classList.add('highlight-step');
            setTimeout(() => {
              stepElement.classList.remove('highlight-step');
            }, 2000);
          }
        }, 300); // Delay to ensure content is loaded

        return () => clearTimeout(scrollTimer);
      }
    }
  }, [pathname, steps.length]);

  const toggleStep = (index) => {
    setCompletedSteps(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const openImageModal = (imageSrc, imageAlt) => {
    setExpandedMedia({ src: imageSrc, alt: imageAlt });
  };

  const closeImageModal = () => {
    setExpandedMedia(null);
  };


  return (
    <>
    <div>

        <div className="space-y-8">
        {steps.map((step, index) => {
          const isCompleted = completedSteps[index];

          return (
            <div
                id={`step-${index + 1}`}
              key={index}
                className={`relative pl-12 pb-8 border-l-2 scroll-mt-20 ${
                isCompleted
                  ? 'border-green-500'
                  : 'border-gray-300 dark:border-gray-700'
              } last:border-l-0 last:pb-0 transition-colors`}
            >
              <button
                onClick={() => toggleStep(index)}
                  className={`absolute left-0 -translate-x-1/2 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all z-10 ${
                  isCompleted
                      ? 'bg-green-500 border-green-500 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:border-purple-500 hover:scale-110'
                }`}
                aria-label={isCompleted ? 'Markera som ej klar' : 'Markera som klar'}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-sm font-semibold">{step.order || index + 1}</span>
                )}
              </button>

              <div className={`${isCompleted ? 'opacity-60' : ''} transition-opacity`}>
                {step.title && (
                    <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                  )}

                  {/* Small screens: Title → Description → Image (stacked) */}
                  {/* Large screens: Image + Description side by side */}
                  {(() => {
                    const hasImage = step.stepImage?.src;

                    // Render image component if it exists
                    const renderImage = () => {
                      if (hasImage) {
                        return (
                          <div className="flex-shrink-0 w-full lg:w-64 xl:w-80">
                            <div 
                              className="step-image relative aspect-video lg:aspect-[4/3] rounded-xl overflow-hidden shadow-lg group cursor-pointer border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 hover:shadow-xl"
                              onClick={() => openImageModal(step.stepImage.src, step.stepImage.alt || step.title || `Steg ${index + 1}`)}
                            >
                              <img
                                src={step.stepImage.src}
                                alt={step.stepImage.alt || step.title || `Steg ${index + 1}`}
                                width="320"
                                height="240"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                loading="lazy"
                                decoding="async"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                              </div>
                              <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold text-purple-600 dark:text-purple-400 shadow-md">
                                {index + 1}
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    };

                    return (
                      <>
                        {/* Small screens: Description first, then Image */}
                        <div className="lg:hidden space-y-4 mb-4">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {step.description}
                          </p>
                          {hasImage && renderImage()}
                        </div>

                        {/* Large screens: Image + Description side by side */}
                        <div className={`hidden lg:flex ${hasImage ? 'lg:flex-row' : ''} gap-4 mb-4`}>
                          {hasImage && renderImage()}
                          <div className="flex-1">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </>
                    );
                  })()}

                  {/* Additional Info */}
                <div className="flex flex-wrap gap-3">
                  {step.timeMinutes && (
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                      <Clock className="w-4 h-4" />
                      <span>{step.timeMinutes} min</span>
                    </div>
                  )}

                  {step.tip && (
                      <div className="flex items-start gap-2 text-sm bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-200 rounded-lg px-4 py-3 w-full border border-blue-200 dark:border-blue-800">
                      <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{step.tip}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>

      {/* Image Modal/Lightbox */}
      {expandedMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={closeImageModal}
        >
          <button
            onClick={closeImageModal}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
            aria-label="Stäng"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div 
            className="relative max-w-5xl max-h-[90vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl">
              <img
                src={expandedMedia.src}
                alt={expandedMedia.alt}
                width="1200"
                height="900"
                className="w-full h-full object-contain"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

