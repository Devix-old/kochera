import Link from 'next/link';

export default function Footer() {
  const mainLinks = [
    { name: 'Startseite', href: '/' },
    { name: 'Rezepte', href: '/rezepte' },
    { name: 'Kategorien', href: '/rezepte' },
    { name: 'Über uns', href: '/ueber-uns' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <Link href="/" className="flex items-center space-x-2" aria-label="kochira Startseite">
              <div className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg font-playfair">
                kochira
              </div>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Deutschlands beste Sammlung von Rezepten und Kochführern.
            </p>
          </div>

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
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} kochira. Alle Rechte vorbehalten.
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              <Link
                href="/datenschutz"
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
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
