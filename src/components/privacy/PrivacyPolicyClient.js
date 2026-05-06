'use client';

import Link from 'next/link';
import { Shield, ArrowLeft, Mail, Globe, Building2 } from 'lucide-react';

export default function PrivacyPolicyClient() {
  const lastUpdated = new Date().toLocaleDateString('de-DE', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100">
      
      {/* Navigation Bar (Minimal) */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zur Startseite
          </Link>
        </div>
      </div>

      <main className="px-4 py-12 md:py-20">
        <article className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          
          {/* Header Section */}
          <div className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800 p-8 md:p-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 mb-6">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">
              Datenschutzerklärung
            </h1>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Zuletzt aktualisiert: <span className="text-gray-900 dark:text-gray-200">{lastUpdated}</span>
            </p>
          </div>

          {/* Content Body */}
          <div className="p-8 md:p-12 divide-y divide-gray-100 dark:divide-gray-800 space-y-12 [&>section]:pt-12 first:[&>section]:pt-0">
            
            {/* 1. Introduction */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">1. Einleitung</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Auf kochira.de respektieren wir Ihre Privatsphäre und sind bestrebt, Ihre personenbezogenen Daten zu schützen. 
                Diese Datenschutzerklärung erläutert, wie wir Ihre personenbezogenen Daten sammeln, verwenden und schützen, wenn Sie 
                unsere Website nutzen.
              </p>
            </section>

            {/* 2. Controller */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">2. Verantwortliche Stelle</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                kochira ist die verantwortliche Stelle für die Verarbeitung deiner personenbezogenen Daten.
              </p>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">info@kochira.de</span>
              </div>
            </section>

            {/* 3. Data Collection */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">3. Welche personenbezogenen Daten erheben wir?</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Wir erheben folgende Arten von personenbezogenen Daten:
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3 text-gray-600 dark:text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 flex-shrink-0" />
                  <span><strong className="text-gray-900 dark:text-white">Kontaktformular:</strong> Wenn du eine Nachricht über unser Kontaktformular sendest, erheben wir deinen Namen, deine E-Mail-Adresse, den Betreff und die Nachricht.</span>
                </li>
                <li className="flex gap-3 text-gray-600 dark:text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 flex-shrink-0" />
                  <span><strong className="text-gray-900 dark:text-white">Technische Informationen:</strong> Wir erheben automatisch technische Informationen wie IP-Adresse, Browsertyp, Betriebssystem und Besuchsstatistiken.</span>
                </li>
                <li className="flex gap-3 text-gray-600 dark:text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 flex-shrink-0" />
                  <span><strong className="text-gray-900 dark:text-white">Cookies:</strong> Wir verwenden Cookies, um dein Erlebnis auf der Website zu verbessern und für Analysezwecke.</span>
                </li>
              </ul>
            </section>

            {/* 4. Usage */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">4. Wie verwenden wir deine personenbezogenen Daten?</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Wir verwenden deine personenbezogenen Daten für folgende Zwecke:
              </p>
              <ul className="grid sm:grid-cols-2 gap-3">
                {['Anfragen beantworten', 'Website verbessern', 'Nutzung analysieren', 'Sicherheit & Betrugsprävention'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/30 p-3 rounded border border-gray-100 dark:border-gray-800">
                    <div className="w-1 h-1 rounded-full bg-gray-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* 5. Legal Basis */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">5. Rechtsgrundlage</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Einwilligung</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Wenn du aktiv Nachrichten an uns sendest.</p>
                </div>
                <div className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 py-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Berechtigtes Interesse</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Um unseren Dienst zu betreiben, zu analysieren und zu verbessern.</p>
                </div>
                <div className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 py-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Rechtliche Verpflichtung</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Um der deutschen Gesetzgebung zu entsprechen.</p>
                </div>
              </div>
            </section>

            {/* 6. Sharing */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">6. Weitergabe personenbezogener Daten</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Wir verkaufen deine Daten niemals. Wir geben sie nur weiter an:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2 text-gray-600 dark:text-gray-300 marker:text-gray-400">
                <li>Dienstleister, die uns beim Betrieb der Website helfen (z.B. Hosting)</li>
                <li>Behörden, wenn wir rechtlich dazu verpflichtet sind</li>
                <li>Dritte nur mit deiner ausdrücklichen Einwilligung</li>
              </ul>
            </section>

            {/* 7. Protection */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">7. Datensicherheit</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Wir ergreifen geeignete technische und organisatorische Maßnahmen, um deine personenbezogenen Daten
                vor unbefugtem Zugriff, Verlust oder Zerstörung zu schützen. Alle personenbezogenen Daten werden
                sicher übertragen (SSL) und auf sicheren Servern gespeichert.
              </p>
            </section>

            {/* 8. Your Rights */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">8. Deine Rechte</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Gemäß DSGVO hast du das Recht auf:</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  'Information über die Verarbeitung',
                  'Auskunft über deine Daten',
                  'Berichtigung falscher Daten',
                  'Löschung („Recht auf Vergessenwerden")',
                  'Einschränkung der Verarbeitung',
                  'Datenübertragbarkeit',
                  'Widerspruch gegen die Verarbeitung'
                ].map((right) => (
                  <div key={right} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Shield className="w-4 h-4 text-green-600 dark:text-green-500 flex-shrink-0" />
                    {right}
                  </div>
                ))}
              </div>
            </section>

            {/* 9. Cookies */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">9. Cookies</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Wir verwenden Cookies, um dein Erlebnis zu verbessern. Du kannst deine Einstellungen jederzeit
                in deinem Browser verwalten. Bitte beachte, dass einige Funktionen eingeschränkt sein können,
                wenn Cookies deaktiviert sind.
              </p>
            </section>

            {/* 10. Storage Time */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">10. Speicherdauer</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Wir speichern deine Daten so lange, wie es für den jeweiligen Zweck oder gesetzlich erforderlich ist.
                Kontaktnachrichten werden bis zur Klärung des Anliegens gespeichert, zuzüglich einer administrativen
                Nachbearbeitungszeit.
              </p>
            </section>

            {/* 11. Changes */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">11. Änderungen</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Wir können diese Richtlinie aktualisieren. Änderungen werden hier mit neuem Datum veröffentlicht.
                Wir empfehlen dir, diese Seite regelmäßig zu lesen.
              </p>
            </section>

            {/* 12. Contact */}
            <section>
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">12. Kontakt</h2>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-100 dark:border-gray-800">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 text-gray-900 dark:text-white font-semibold">
                      <Mail className="w-4 h-4" /> E-Mail
                    </div>
                    <a href="mailto:info@kochira.de" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
                      info@kochira.de
                    </a>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 text-gray-900 dark:text-white font-semibold">
                      <Globe className="w-4 h-4" /> Website
                    </div>
                    <Link href="/kontakt" className="text-blue-600 dark:text-blue-400 hover:underline">
                      Zum Kontaktformular
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* 13. Complaints */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">13. Beschwerden</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                Wenn du der Meinung bist, dass wir deine personenbezogenen Daten nicht ordnungsgemäß verarbeiten,
                hast du das Recht, eine Beschwerde bei der zuständigen Aufsichtsbehörde einzureichen.
              </p>

              <div className="flex items-start gap-4 p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                  <Building2 className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">Bundesbeauftragter für den Datenschutz (BfDI)</h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>Graurheindorfer Str. 153, 53117 Bonn</p>
                    <p>Telefon: 0228-997799-0</p>
                    <a href="mailto:poststelle@bfdi.bund.de" className="text-blue-600 dark:text-blue-400 hover:underline">poststelle@bfdi.bund.de</a>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </article>
      </main>
    </div>
  );
}