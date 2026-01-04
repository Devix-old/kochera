'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, ChefHat } from 'lucide-react';

export default function OmClient() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section - Simple and Clean */}
      <section className="relative py-16 md:py-24 px-4 overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 
              className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Hej, jag är Elsa
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              En tjej som älskar att laga mat och dela mina favoritrecept med dig
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content - Image and Story */}
      <section className="relative px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Image - Circle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative mx-auto rounded-full overflow-hidden shadow-xl border-4 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
            >
              <img
                src="/images/face_image.jpg"
                alt="Elsa Andersson"
                width="256"
                height="256"
                className="object-cover rounded-full"
                loading="eager"
                decoding="async"
              />
            </motion.div>

            {/* Story */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  Min historia
                </span>
              </div>
              
              <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                <p>
                  Jag heter Elsa och matlagning är min passion. Jag älskar att testa nya recept, experimentera i köket och framför allt – dela med mig av det som fungerar.
                </p>
                <p>
                  Bakstunden är min plats där jag delar mina favoritrecept med dig. Varje recept har jag testat själv, ofta flera gånger, för att säkerställa att det verkligen fungerar.
                </p>
                <p>
                  Min filosofi är enkel: matlagning ska vara roligt och tillgängligt för alla. Inga komplicerade tekniker eller svåråtkomliga ingredienser – bara goda, enkla recept som ger resultat.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Simple Values */}
      <section className="relative px-4 py-12 md:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Det här är viktigt för mig
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700"
            >
              <Heart className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Kärlek till mat</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Varje recept kommer från hjärtat
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700"
            >
              <ChefHat className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Enkelt & testat</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Alla recept är provlagade flera gånger
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700"
            >
              <Heart className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Delning</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Att dela glädje med alla som gillar mat
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Simple CTA */}
      <section className="relative px-4 py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 md:p-12 text-center border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Redo att börja laga mat?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
              Utforska mina recept och hitta din nästa favorit idag
            </p>
            <Link
              href="/recept"
              className="inline-flex items-center gap-2 px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
            >
              <ChefHat className="w-5 h-5" />
              <span>Se alla recept</span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
