'use client';

import Link from 'next/link';
import { Shield, ArrowLeft, Mail, Globe, Building2 } from 'lucide-react';

export default function PrivacyPolicyClient() {
  const lastUpdated = new Date().toLocaleDateString('sv-SE', { 
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
            Tillbaka till startsidan
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
              Integritetspolicy
            </h1>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Senast uppdaterad: <span className="text-gray-900 dark:text-gray-200">{lastUpdated}</span>
            </p>
          </div>

          {/* Content Body */}
          <div className="p-8 md:p-12 divide-y divide-gray-100 dark:divide-gray-800 space-y-12 [&>section]:pt-12 first:[&>section]:pt-0">
            
            {/* 1. Introduction */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">1. Inledning</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                På kochera.de respekterar vi din integritet och är engagerade i att skydda dina personuppgifter. 
                Denna integritetspolicy förklarar hur vi samlar in, använder och skyddar dina personuppgifter när du 
                använder vår webbplats.
              </p>
            </section>

            {/* 2. Controller */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">2. Personuppgiftsansvarig</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                kochera är personuppgiftsansvarig för behandlingen av dina personuppgifter.
              </p>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">info@kochera.de</span>
              </div>
            </section>

            {/* 3. Data Collection */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">3. Vilka personuppgifter samlar vi in?</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Vi samlar in följande typer av personuppgifter:
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3 text-gray-600 dark:text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 flex-shrink-0" />
                  <span><strong className="text-gray-900 dark:text-white">Kontaktformulär:</strong> När du skickar ett meddelande via vårt kontaktformulär samlar vi in ditt namn, e-postadress, ämne och meddelande.</span>
                </li>
                <li className="flex gap-3 text-gray-600 dark:text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 flex-shrink-0" />
                  <span><strong className="text-gray-900 dark:text-white">Teknisk information:</strong> Vi samlar automatiskt in teknisk information som IP-adress, webbläsartyp, operativsystem och besöksstatistik.</span>
                </li>
                <li className="flex gap-3 text-gray-600 dark:text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 flex-shrink-0" />
                  <span><strong className="text-gray-900 dark:text-white">Cookies:</strong> Vi använder cookies för att förbättra din upplevelse på webbplatsen och för analysändamål.</span>
                </li>
              </ul>
            </section>

            {/* 4. Usage */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">4. Hur använder vi dina personuppgifter?</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Vi använder dina personuppgifter för följande ändamål:
              </p>
              <ul className="grid sm:grid-cols-2 gap-3">
                {['Svara på förfrågningar', 'Förbättra webbplatsen', 'Analysera användning', 'Säkerhet & bedrägeriskydd'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/30 p-3 rounded border border-gray-100 dark:border-gray-800">
                    <div className="w-1 h-1 rounded-full bg-gray-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* 5. Legal Basis */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">5. Rättslig grund</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Samtycke</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">När du aktivt skickar meddelanden till oss.</p>
                </div>
                <div className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 py-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Berättigat intresse</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">För att driva, analysera och förbättra vår tjänst.</p>
                </div>
                <div className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 py-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Rättslig förpliktelse</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">För att följa svensk lagstiftning.</p>
                </div>
              </div>
            </section>

            {/* 6. Sharing */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">6. Delning av personuppgifter</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Vi säljer aldrig dina uppgifter. Vi delar dem endast med:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2 text-gray-600 dark:text-gray-300 marker:text-gray-400">
                <li>Leverantörer som hjälper oss att driva webbplatsen (t.ex. hosting)</li>
                <li>Myndigheter om vi är juridiskt skyldiga</li>
                <li>Tredje part endast om du gett uttryckligt samtycke</li>
              </ul>
            </section>

            {/* 7. Protection */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">7. Dataskydd</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Vi vidtar lämpliga tekniska och organisatoriska åtgärder för att skydda dina personuppgifter mot 
                obehörig åtkomst, förlust eller förstörelse. Alla personuppgifter överförs säkert (SSL) och lagras på 
                säkra servrar.
              </p>
            </section>

            {/* 8. Your Rights */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">8. Dina rättigheter</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Enligt GDPR har du rätt till:</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  'Information om behandling',
                  'Tillgång till dina uppgifter',
                  'Rättelse av felaktig data',
                  'Radering ("Rätten att bli glömd")',
                  'Begränsning av behandling',
                  'Dataportabilitet',
                  'Invändning mot behandling'
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
                Vi använder cookies för att förbättra din upplevelse. Du kan när som helst hantera dina inställningar 
                i din webbläsare. Notera att vissa funktioner kan begränsas om cookies inaktiveras.
              </p>
            </section>

            {/* 10. Storage Time */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">10. Förvaringstid</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Vi sparar dina uppgifter så länge det behövs för ändamålet eller enligt lag. Kontaktmeddelanden sparas 
                tills ärendet är löst, plus en administrativ period för uppföljning.
              </p>
            </section>

            {/* 11. Changes */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">11. Ändringar</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Vi kan uppdatera denna policy. Ändringar publiceras här med nytt datum. Vi rekommenderar att du läser 
                denna sida regelbundet.
              </p>
            </section>

            {/* 12. Contact */}
            <section>
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">12. Kontakta oss</h2>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-100 dark:border-gray-800">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 text-gray-900 dark:text-white font-semibold">
                      <Mail className="w-4 h-4" /> E-post
                    </div>
                    <a href="mailto:info@kochera.de" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
                      info@kochera.de
                    </a>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 text-gray-900 dark:text-white font-semibold">
                      <Globe className="w-4 h-4" /> Webbplats
                    </div>
                    <Link href="/kontakt" className="text-blue-600 dark:text-blue-400 hover:underline">
                      Gå till kontaktformuläret
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* 13. Complaints */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">13. Klagomål</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                Om du anser att vi brister i vår hantering av dina personuppgifter har du rätt att lämna klagomål till tillsynsmyndigheten.
              </p>
              
              <div className="flex items-start gap-4 p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                  <Building2 className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">Integritetsskyddsmyndigheten (IMY)</h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>Box 8114, 104 20 Stockholm</p>
                    <p>Telefon: 08-657 61 00</p>
                    <a href="mailto:imy@imy.se" className="text-blue-600 dark:text-blue-400 hover:underline">imy@imy.se</a>
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