'use client';

import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

export default function CategoryCarousel({ categories, currentCategory }) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="relative bg-gradient-to-br from-white via-purple-50/30 to-white dark:from-gray-800 dark:via-purple-950/20 dark:to-gray-800 rounded-3xl p-6 md:p-10 mb-12 border border-purple-100/50 dark:border-purple-900/30 shadow-xl overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-400/5 rounded-full blur-3xl -z-0" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl -z-0" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent mb-2">
              Utforska fler kategorier
            </h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              Upptäck vårt urval av recept från olika kategorier
            </p>
          </div>
          
          {/* Category count badge */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
            <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
              {categories.length} kategorier
            </span>
          </div>
        </div>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={2}
          slidesPerGroup={2}
          navigation={{
            enabled: true,
          }}
          pagination={{ 
            clickable: true,
            dynamicBullets: true,
            dynamicMainBullets: 3,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 3,
              slidesPerGroup: 3,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 4,
              slidesPerGroup: 4,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 5,
              slidesPerGroup: 5,
              spaceBetween: 24,
            },
            1280: {
              slidesPerView: 6,
              slidesPerGroup: 6,
              spaceBetween: 24,
            },
          }}
          className="category-swiper !pb-12"
          loop={categories.length > 6}
        >
          {categories.map((category) => {
            const isActive = currentCategory === category.slug;
            
            return (
              <SwiperSlide key={category.slug}>
                <Link
                  href={`/${category.slug}`}
                  className={`group block rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                    isActive
                      ? 'ring-2 ring-purple-600 dark:ring-purple-400 shadow-2xl shadow-purple-500/20'
                      : 'shadow-lg hover:shadow-xl hover:shadow-purple-500/10'
                  }`}
                >
                  {category.image ? (
                    <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                      <img
                        src={category.image}
                        alt={category.name}
                        width="300"
                        height="300"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                        loading="lazy"
                        decoding="async"
                      />
                      
                      {/* Gradient overlay */}
                      <div className={`absolute inset-0 transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-t from-purple-900/90 via-purple-900/60 to-transparent'
                          : 'bg-gradient-to-t from-black/70 via-black/40 to-transparent group-hover:from-purple-900/80 group-hover:via-purple-900/50'
                      }`} />
                      
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute top-3 right-3 w-3 h-3 bg-purple-400 rounded-full shadow-lg shadow-purple-500/50 animate-pulse" />
                      )}
                      
                      {/* Category name */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className={`font-bold text-sm md:text-base text-white drop-shadow-lg transition-transform duration-300 ${
                          isActive ? 'translate-y-0' : 'group-hover:-translate-y-1'
                        }`}>
                          {category.name}
                        </div>
                        
                        {/* Recipe count if available */}
                        {category.count && (
                          <div className="text-xs text-white/90 mt-1 font-medium">
                            {category.count} recept
                          </div>
                        )}
                      </div>
                      
                      {/* Hover shine effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
                      </div>
                    </div>
                  ) : (
                    <div className={`relative p-6 text-center aspect-square flex flex-col items-center justify-center transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-900/20 text-purple-700 dark:text-purple-300'
                        : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300 group-hover:from-purple-50 group-hover:to-purple-100 dark:group-hover:from-purple-900/30 dark:group-hover:to-purple-900/10 group-hover:text-purple-600 dark:group-hover:text-purple-400'
                    }`}>
                      {isActive && (
                        <div className="absolute top-3 right-3 w-3 h-3 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50 animate-pulse" />
                      )}
                      <div className="font-bold text-sm md:text-base">
                        {category.name}
                      </div>
                      {category.count && (
                        <div className="text-xs mt-2 opacity-75 font-medium">
                          {category.count} recept
                        </div>
                      )}
                    </div>
                  )}
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
        
        {/* Custom Swiper Styles */}
        <style jsx global>{`
          /* Navigation Buttons */
          .category-swiper .swiper-button-next,
          .category-swiper .swiper-button-prev {
            color: rgb(147, 51, 234);
            background: white;
            border-radius: 50%;
            width: 44px;
            height: 44px;
            box-shadow: 0 4px 12px rgba(147, 51, 234, 0.15);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 2px solid rgb(243, 232, 255);
          }
          
          .dark .category-swiper .swiper-button-next,
          .dark .category-swiper .swiper-button-prev {
            background: rgb(31, 41, 55);
            border-color: rgb(88, 28, 135);
            box-shadow: 0 4px 12px rgba(147, 51, 234, 0.3);
          }
          
          .category-swiper .swiper-button-next:hover,
          .category-swiper .swiper-button-prev:hover {
            background: rgb(147, 51, 234);
            color: white;
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(147, 51, 234, 0.4);
            border-color: rgb(147, 51, 234);
          }
          
          .category-swiper .swiper-button-next::after,
          .category-swiper .swiper-button-prev::after {
            font-size: 18px;
            font-weight: bold;
          }
          
          .category-swiper .swiper-button-disabled {
            opacity: 0.35;
            cursor: not-allowed;
          }
          
          /* Pagination */
          .category-swiper .swiper-pagination {
            bottom: 0 !important;
          }
          
          .category-swiper .swiper-pagination-bullet {
            background: rgb(147, 51, 234);
            opacity: 0.25;
            width: 8px;
            height: 8px;
            transition: all 0.3s;
          }
          
          .category-swiper .swiper-pagination-bullet-active {
            opacity: 1;
            background: rgb(147, 51, 234);
            width: 24px;
            border-radius: 4px;
          }
          
          .dark .category-swiper .swiper-pagination-bullet {
            background: rgb(196, 181, 253);
          }
          
          .dark .category-swiper .swiper-pagination-bullet-active {
            background: rgb(196, 181, 253);
          }
          
          /* Mobile optimizations */
          @media (max-width: 640px) {
            .category-swiper .swiper-button-next,
            .category-swiper .swiper-button-prev {
              width: 36px;
              height: 36px;
            }
            
            .category-swiper .swiper-button-next::after,
            .category-swiper .swiper-button-prev::after {
              font-size: 14px;
            }
          }
          
          /* Improve touch responsiveness */
          .category-swiper .swiper-slide {
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
          }
          
          /* Loading state */
          @keyframes shimmer {
            0% {
              background-position: -1000px 0;
            }
            100% {
              background-position: 1000px 0;
            }
          }
          
          /* Smooth scrolling */
          .category-swiper .swiper-wrapper {
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          }
        `}</style>
      </div>
    </section>
  );
}