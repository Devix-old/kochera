'use client';

import { motion } from 'framer-motion';
import { Star, Users, BookOpen, Award, Quote } from 'lucide-react';

export default function SocialProof({ totalRecipes, totalViews = 125000 }) {
  const stats = [
    {
      icon: BookOpen,
      value: totalRecipes || '100+',
      label: 'Provlagade recept',
      color: 'from-[#FF7A7A] to-[#FFA07A]',
    },
    {
      icon: Users,
      value: '50K+',
      label: 'Läsare per månad',
      color: 'from-[#6FCF97] to-[#A8E6CF]',
    },
    {
      icon: Star,
      value: '4.8',
      label: 'Genomsnittligt betyg',
      color: 'from-[#FFA07A] to-[#FFB4B4]',
    },
    {
      icon: Award,
      value: '10+',
      label: 'Utmärkelser',
      color: 'from-[#FF7A7A] to-[#6FCF97]',
    },
  ];

  const testimonials = [
    {
      name: 'Emma Andersson',
      role: 'Matentusiast',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
      text: 'kochera har revolutionerat min vardag! Recepten är tydliga och alltid lyckas. Min familj älskar allt vi provar.',
      rating: 5,
    },
    {
      name: 'Lars Svensson',
      role: 'Hobbykock',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
      text: 'Äntligen en receptsida som förstår vardagsköket. Enkla ingredienser och perfekt tajmade instruktioner.',
      rating: 5,
    },
    {
      name: 'Sofia Lindqvist',
      role: 'Nybörjare i köket',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
      text: 'Som nybörjare var jag nervös, men kocheras guider och steg-för-steg instruktioner har gjort mig trygg!',
      rating: 5,
    },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br shadow-lg mb-4" style={{ backgroundImage: `linear-gradient(to bottom right, ${stat.color.split(' ')[0].replace('from-', 'var(--color-primary)')}, ${stat.color.split(' ')[1].replace('to-', 'var(--color-accent)')})` }}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, #FF7A7A, #FFA07A)` }}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
          >
            Vad våra läsare säger
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Tusentals matälskare litar på kochera för sina dagliga recept
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10">
                <Quote className="w-16 h-16 text-[#FF7A7A]" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#FFA07A] text-[#FFA07A]" />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width="48"
                    height="48"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Awards/Mentions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">
            Utmärkelser & omnämnanden
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60">
            <span className="text-2xl font-bold text-gray-400">Best Food Blog 2024</span>
            <span className="text-2xl font-bold text-gray-400">Top 10 Sverige</span>
            <span className="text-2xl font-bold text-gray-400">Readers&apos; Choice</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

