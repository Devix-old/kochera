'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Mail, 
  Clock, 
  Send, 
  Instagram, 
  Youtube, 
  Facebook, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';

export default function KontaktClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/kontakt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || 'Något gick fel.';
        throw new Error(errorMessage);
      }

      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error.message || 'Ett fel uppstod. Försök igen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    { name: 'Instagram', url: 'https://www.instagram.com/alissam407/', icon: Instagram },
    { name: 'YouTube', url: 'https://youtube.com/@malty', icon: Youtube },
    { name: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61581970813224', icon: Facebook }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
      
      {/* Professional Header Section - Minimalist */}
      <section className="pt-12 pb-12 px-4 md:pt-12 md:pb-16 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-semibold tracking-wide mb-4">
            Kontakt
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Hör av dig till oss
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Har du frågor om recept, samarbeten eller vill du bara säga hej? 
            Fyll i formuläret nedan så återkommer vi inom kort.
          </p>
        </motion.div>
      </section>

      {/* Main Content Grid */}
      <section className="px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Contact Form */}
            <motion.div 
              className="lg:col-span-7"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Namn
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                        placeholder="Anna Andersson"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        E-post
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                        placeholder="anna@exempel.se"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Ämne
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Vad gäller saken?"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Meddelande
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                      placeholder="Skriv ditt meddelande här..."
                    />
                  </div>

                  {/* Status Messages */}
                  {submitStatus === 'success' && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm font-medium">Tack! Ditt meddelande har skickats.</p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm font-medium">{errorMessage}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-lg hover:bg-purple-600 dark:hover:bg-purple-200 dark:hover:text-purple-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Skicka meddelande <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Right Column: Info & Socials */}
            <motion.div 
              className="lg:col-span-5 space-y-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Info Cards */}
              <div className="grid gap-6">
                <div className="flex items-start gap-4 p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">E-post</h3>
                    <a 
                      href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@kochera.de'}`}
                      className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      {process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@kochera.de'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Svarstid</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Vi svarar vanligtvis inom 24 timmar på vardagar.
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media Section */}
              <div className="p-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h3 className="text-xl font-bold mb-4">Följ oss</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                  För dagliga recept, tips och inspiration från köket.
                </p>
                <div className="flex gap-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <Link
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-center w-12 h-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-purple-500 hover:text-purple-600 dark:hover:border-purple-400 dark:hover:text-purple-300 transition-all duration-300 shadow-sm hover:shadow-md"
                        aria-label={social.name}
                      >
                        <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* FAQ Teaser - Minimalist */}
              <div className="p-6 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-between group hover:border-purple-400 transition-colors bg-white dark:bg-gray-900/30">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">Vanliga frågor</span>
                </div>
                <Link 
                  href="/ueber-uns" 
                  className="flex items-center gap-1 text-sm font-semibold text-purple-600 dark:text-purple-400 group-hover:gap-2 transition-all"
                >
                  Läs mer <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}