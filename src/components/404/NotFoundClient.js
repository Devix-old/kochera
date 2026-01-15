'use client';

import Link from 'next/link';
import { Home, Search, ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFoundClient() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 dark:border-gray-700"
        >
          {/* 404 Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
              <ChefHat className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold text-gray-900 dark:text-white mb-4">
              404
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
              Oops! Sidan hittades inte
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Den sida du letar efter finns inte längre eller har flyttats. 
              Men oroa dig inte - vi har massor av goda recept som väntar på dig!
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Home className="w-5 h-5" />
              Tillbaka till startsidan
            </Link>
            
            <Link
              href="/rezepte"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transform hover:scale-105 transition-all duration-300"
            >
              <Search className="w-5 h-5" />
              Utforska alla recept
            </Link>
          </motion.div>

          {/* Popular Categories */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12"
          >
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-6">
              Beliebte Kategorien
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: 'Pfannkuchen', href: '/pfannkuchen', emoji: '🥞' },
                { name: 'Kuchen', href: '/kuchen', emoji: '🍰' },
                { name: 'Waffeln', href: '/waffeln', emoji: '🧇' },
                { name: 'Vegetarisch', href: '/vegetarisch', emoji: '🌱' },
              ].map((category, index) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors duration-300 group"
                >
                  <span className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                    {category.emoji}
                  </span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Om du tror att detta är ett fel,{' '}
              <Link 
                href="/om" 
                className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 underline"
              >
                kontakta oss
              </Link>
              {' '}så hjälper vi dig!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
