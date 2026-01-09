import Link from 'next/link';
import { Instagram, Youtube, Facebook } from 'lucide-react';

export default function Footer() {
  const mainLinks = [
    { name: "Startseite", href: '/' },
    { name: 'Rezepte', href: '/rezepte' },
    { name: 'Kategorien', href: '/kategorier' },
    { name: 'Über uns', href: '/om' },
    { name: 'Kontakt', href: '/kontakt' },
  ];

  const socialLinks = [
    { name: 'Instagram', href: '#', icon: Instagram },
    { name: 'YouTube', href: '#', icon: Youtube },
    { name: 'Facebook', href: '#', icon: Facebook },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
          <Link href="/" className="flex items-center space-x-2" aria-label="Kochera Startseite">
            <div className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg font-playfair">
              Kochera
            </div>
          </Link>
            <p className="text-sm text-gray-400 mb-4">
              Deutschlands beste Sammlung von Rezepten und Kochführern.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              {mainLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold mb-4">Folge uns</h3>
            <div className="flex space-x-3">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href="#"
                    className="p-3 hover:bg-gray-800 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label={link.name}
                  >
                    <Icon className="w-6 h-6" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Kochera. Alle Rechte vorbehalten.
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              <Link
                href="/privacy-policy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Datenschutzerklärung
              </Link>
              <Link
                href="/impressum"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Impressum
              </Link>
              <Link
                href="/agb"
                className="text-gray-400 hover:text-white transition-colors"
              >
                AGB
              </Link>
              <Link
                href="/disclaimer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Haftungsausschluss
              </Link>
              <Link
                href="/cookie-policy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Cookie-Richtlinie
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

