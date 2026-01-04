'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChefHat, Instagram, Youtube, Heart } from 'lucide-react';

export default function AuthorsSection({ authors }) {
  // Fallback authors if none provided
  const displayAuthors = authors && authors.length > 0 ? authors.slice(0, 3) : [
    {
      name: 'Anna Bergström',
      slug: 'anna-bergstrom',
      bio: 'Passionerad matlagare med fokus på vegetarisk matlagning och hållbarhet. Älskar att experimentera med säsongens råvaror.',
      avatar: { src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', alt: 'Anna' },
      social: { instagram: 'annakokar', youtube: 'annaskok' },
      recipesCount: 45,
      specialty: 'Vegetariskt',
    },
    {
      name: 'Erik Lindström',
      slug: 'erik-lindstrom',
      bio: 'Självlärd kock med passion för svensk husmanskost och moderna interpretationer av klassiker.',
      avatar: { src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', alt: 'Erik' },
      social: { instagram: 'eriksmatblogg', youtube: 'erikkokar' },
      recipesCount: 38,
      specialty: 'Svensk husmanskost',
    },
    {
      name: 'Maria Svensson',
      slug: 'maria-svensson',
      bio: 'Konditor och bagare med kärleken för desserter och bakverk. Delar med sig av familjerecept och nya favoriter.',
      avatar: { src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80', alt: 'Maria' },
      social: { instagram: 'mariasbakverk' },
      recipesCount: 52,
      specialty: 'Bakning & Desserter',
    },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF7A7A]/10 text-[#FF7A7A] rounded-full text-sm font-semibold">
              <ChefHat className="w-4 h-4" />
              Våra kockar
            </span>
          </div>
          <h2 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
          >
            Möt våra matkreatörer
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Passionerade matentusiaster som delar sina bästa recept med dig
          </p>
        </motion.div>

        {/* Authors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayAuthors.map((author, index) => (
            <motion.div
              key={author.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={authors && authors.length > 0 ? `/author/${author.slug}` : '#'}
                className="group block h-full"
              >
                <div className="bg-white dark:bg-gray-800 overflow-hidden transition-all duration-300 transform hover:-translate-y-2 h-full">
                  {/* Avatar */}
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#FF7A7A] to-[#FFA07A]">
                    {author.avatar?.src ? (
                      <img
                        src={author.avatar.src}
                        alt={author.avatar.alt || author.name}
                        width="400"
                        height="400"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ChefHat className="w-24 h-24 text-white" />
                      </div>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-3 text-white">
                          {author.social?.instagram && (
                            <Instagram className="w-5 h-5" />
                          )}
                          {author.social?.youtube && (
                            <Youtube className="w-5 h-5" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-[#FF7A7A] transition-colors">
                      {author.name}
                    </h3>
                    
                    {author.specialty && (
                      <div className="mb-3">
                        <span className="inline-block px-3 py-1 bg-gradient-to-r from-[#FF7A7A] to-[#FFA07A] text-white text-xs font-semibold">
                          {author.specialty}
                        </span>
                      </div>
                    )}

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed line-clamp-3">
                      {author.bio}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-2 text-sm">
                        <Heart className="w-4 h-4 text-[#FF7A7A]" />
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {author.recipesCount || 0} recept
                        </span>
                      </div>
                      <span className="text-[#FF7A7A] text-sm font-medium group-hover:underline">
                        Visa profil →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

