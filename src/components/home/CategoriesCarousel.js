'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

export default function CategoriesCarousel({ collections }) {
  return (
    <section className="relative py-20 bg-gradient-to-b from-[#FFF9F0] via-[#FFF5EB] to-[#FFFAF5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative carousel-wrapper">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={32}
            slidesPerView={1}
            loop={false}
            navigation={{
              prevEl: '.custom-prev',
              nextEl: '.custom-next',
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 28,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 32,
              },
              1280: {
                slidesPerView: 5,
                spaceBetween: 36,
              },
            }}
            className="categories-carousel"
          >
            {collections.map((collection, index) => (
              <SwiperSlide key={collection.slug}>
                <Link href={`/kategorier/${collection.slug}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="group cursor-pointer"
                  >
                    <div className="relative w-full aspect-square mb-4 flex items-center justify-center overflow-hidden rounded-full bg-white shadow-sm group-hover:shadow-xl transition-shadow duration-300">
                      <img
                        src={collection.image}
                        alt={collection.title}
                        width="200"
                        height="200"
                        className="w-full h-full object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-110"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <h3 className="text-center text-base md:text-lg font-semibold text-gray-800 group-hover:text-[#FF7A7A] transition-colors duration-300">
                      {collection.title}
                    </h3>
                  </motion.div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation - Perfectly Aligned */}
          <button 
            className="custom-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-[#FF7A7A] hover:text-white transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-800"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button 
            className="custom-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-[#FF7A7A] hover:text-white transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-800"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <style jsx global>{`
        .carousel-wrapper {
          position: relative;
        }

        .categories-carousel {
          padding: 0 48px;
        }

        .categories-carousel .swiper-slide {
          height: auto;
        }

        /* Remove default Swiper navigation */
        .categories-carousel .swiper-button-next,
        .categories-carousel .swiper-button-prev {
          display: none;
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .categories-carousel {
            padding: 0 40px;
          }
          
          .custom-prev {
            left: -8px;
            transform: translateY(-50%) translateX(0);
          }
          
          .custom-next {
            right: -8px;
            transform: translateY(-50%) translateX(0);
          }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
          .categories-carousel {
            padding: 0 44px;
          }
        }
      `}</style>
    </section>
  );
}

