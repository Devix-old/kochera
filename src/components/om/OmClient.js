'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, ChefHat, ArrowRight } from 'lucide-react';

export default function OmClient() {
  return (
    <div className="min-h-screen bg-white">
      {/* Main Content - Same structure as home page DIN MATKREATÖR section */}
      <section className="w-full py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative overflow-hidden rounded-2xl bg-orange-50 border border-gray-100 shadow-lg flex flex-col md:flex-row">
            
            {/* Image Section - Left on desktop, top on mobile */}
            <div className="w-full md:w-1/2 h-64 md:h-auto">
              <img
                src="/images/din-matkreator-kochera-in-kitchen.webp"
                alt="Kochera in der Küche"
                className="w-full h-full object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
                loading="eager"
              />
            </div>

            {/* Text Content Section - Right on desktop, bottom on mobile */}
            <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
              <span className="inline-block px-3 py-1 mb-3 text-xs font-bold tracking-wider text-white uppercase bg-purple-600 rounded-full w-fit">
                Din Matkreatör
              </span>
              
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                Hallo! Ich bin <span className="text-purple-600">Kochera</span>.
              </h1>
              
              <div className="space-y-3 text-gray-600 text-base md:text-lg leading-relaxed mb-6">
                <p>
                  Willkommen in meiner Küche! Ich habe diese Seite gegründet, um meine Leidenschaft für Kochen und Backen mit dir zu teilen.
                </p>
                <p>
                  Ich glaube an Qualität vor Quantität. Daher ist jedes Rezept, das du hier findest, sorgfältig getestet, verkostet und perfektioniert, um sicherzustellen, dass du jedes Mal erfolgreich bist.
                </p>
                <p>
                  Meine Philosophie ist einfach: Kochen soll Spaß machen und für alle zugänglich sein. Keine komplizierten Techniken oder schwer erhältlichen Zutaten – nur gute, einfache Rezepte, die funktionieren.
                </p>
              </div>

              <Link
                href="/rezepte"
                className="group inline-flex items-center justify-center md:justify-start gap-2 bg-purple-600 text-white font-bold px-5 py-3 rounded-lg border-2 border-black shadow-md hover:bg-purple-700 transition-all duration-200 w-fit"
              >
                <span>Alle Rezepte entdecken</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative px-4 py-12 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Das ist mir wichtig
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-xl p-6 text-center border border-gray-200"
            >
              <Heart className="w-8 h-8 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Liebe zum Kochen</h3>
              <p className="text-gray-600 text-sm">
                Jedes Rezept kommt von Herzen
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl p-6 text-center border border-gray-200"
            >
              <ChefHat className="w-8 h-8 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Einfach & getestet</h3>
              <p className="text-gray-600 text-sm">
                Alle Rezepte sind mehrfach erprobt
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl p-6 text-center border border-gray-200"
            >
              <Heart className="w-8 h-8 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Teilen</h3>
              <p className="text-gray-600 text-sm">
                Freude mit allen teilen, die gerne kochen
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
