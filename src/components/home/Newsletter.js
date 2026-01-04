'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [gdprConsent, setGdprConsent] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!gdprConsent) {
      setStatus('error');
      return;
    }

    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setGdprConsent(false);
      
      // Reset after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    }, 1500);
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-[#FF7A7A] via-[#FFA07A] to-[#FFB4B4] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>

          <h2 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
          >
            Få veckovisa recept
          </h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Få de bästa recepten direkt i din inkorg. Varje vecka delar vi inspiration, tips och nya favoriter!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {status === 'success' ? (
            // Success State
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 text-center">
              <CheckCircle className="w-16 h-16 text-[#6FCF97] mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Tack för din anmälan!
              </h3>
              <p className="text-gray-600">
                Kolla din inkorg för att bekräfta din prenumeration.
              </p>
            </div>
          ) : (
            // Form
            <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 md:p-10 shadow-2xl">
              <div className="space-y-6">
                {/* Email Input */}
                <div>
                  <label htmlFor="newsletter-email" className="block text-sm font-semibold text-gray-700 mb-2">
                    E-postadress *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="newsletter-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="din.epost@exempel.se"
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#FF7A7A] focus:ring-2 focus:ring-[#FF7A7A]/20 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* GDPR Consent */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="gdpr-consent"
                    checked={gdprConsent}
                    onChange={(e) => setGdprConsent(e.target.checked)}
                    required
                    className="mt-1 w-5 h-5 text-[#FF7A7A] border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#FF7A7A]/20 cursor-pointer"
                  />
                  <label htmlFor="gdpr-consent" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                    Jag godkänner att Bakstunden lagrar min e-postadress för att skicka nyhetsbrev. 
                    Du kan avregistrera dig när som helst. Läs mer i vår{' '}
                    <a href="/integritetspolicy" className="text-[#FF7A7A] hover:underline font-medium">
                      integritetspolicy
                    </a>.
                  </label>
                </div>

                {/* Error Message */}
                {status === 'error' && !gdprConsent && (
                  <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    <span>Du måste godkänna vår integritetspolicy för att prenumerera.</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-4 px-6 bg-gradient-to-r from-[#FF7A7A] to-[#FFA07A] text-white font-bold rounded-xl hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Skickar...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Ja, skicka mig recept!
                    </>
                  )}
                </button>

                {/* Privacy Note */}
                <p className="text-xs text-gray-500 text-center">
                  Vi respekterar din integritet. Inga spam, endast goda recept. 🍽️
                </p>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

