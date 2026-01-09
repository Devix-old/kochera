import { generateMetadata as generateSiteMetadata } from '@/lib/seo';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kochera.de';

export const metadata = {
  ...generateSiteMetadata({
    title: 'Allgemeine Geschäftsbedingungen (AGB) - Kochera',
    description: 'Allgemeine Geschäftsbedingungen für die Nutzung von Kochera',
    url: '/agb',
  }),
  robots: {
    index: true,
    follow: true,
  },
};

export default function AGBPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Allgemeine Geschäftsbedingungen (AGB)</h1>
        
        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Geltungsbereich</h2>
            <p className="text-gray-700 leading-relaxed">
              Diese Allgemeinen Geschäftsbedingungen (AGB) regeln die Nutzung der Website Kochera.de (nachfolgend "Kochera" oder "wir"). Durch die Nutzung unserer Website erklären Sie sich mit diesen AGB einverstanden.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Leistungen</h2>
            <p className="text-gray-700 leading-relaxed">
              Kochera bietet eine Plattform für Rezepte und kulinarische Inhalte. Die bereitgestellten Rezepte und Informationen dienen der allgemeinen Information und sind nicht als medizinische, ernährungsphysiologische oder diätetische Beratung zu verstehen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Nutzung der Website</h2>
            <p className="text-gray-700 leading-relaxed">
              Die Nutzung von Kochera ist grundsätzlich kostenlos. Sie verpflichten sich, die Website nur für rechtmäßige Zwecke zu nutzen und keine Inhalte zu verbreiten, die gegen geltendes Recht verstoßen oder die Rechte Dritter verletzen.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Es ist nicht gestattet, die Website oder deren Inhalte zu kopieren, zu vervielfältigen, zu verändern oder kommerziell zu nutzen, soweit dies nicht ausdrücklich gestattet ist.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Haftungsausschluss</h2>
            <p className="text-gray-700 leading-relaxed">
              Kochera übernimmt keine Gewähr für die Richtigkeit, Vollständigkeit oder Aktualität der bereitgestellten Informationen. Die Verwendung der Rezepte erfolgt auf eigene Verantwortung. Kochera haftet nicht für Schäden, die durch die Verwendung der bereitgestellten Rezepte oder Informationen entstehen.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Insbesondere haftet Kochera nicht für:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
              <li>Allergische Reaktionen durch die Verwendung von Rezepten</li>
              <li>Krankheiten oder gesundheitliche Schäden durch die Zubereitung oder den Verzehr von Gerichten</li>
              <li>Schäden an Küchengeräten oder Eigentum bei der Zubereitung</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Urheberrecht</h2>
            <p className="text-gray-700 leading-relaxed">
              Alle Inhalte dieser Website, einschließlich Texte, Bilder, Grafiken und Rezepte, sind urheberrechtlich geschützt. Die Vervielfältigung, Verbreitung oder kommerzielle Nutzung ohne ausdrückliche schriftliche Genehmigung ist nicht gestattet.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Datenschutz</h2>
            <p className="text-gray-700 leading-relaxed">
              Informationen zum Datenschutz finden Sie in unserer Datenschutzerklärung unter /privacy-policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Änderungen der AGB</h2>
            <p className="text-gray-700 leading-relaxed">
              Kochera behält sich vor, diese AGB jederzeit zu ändern. Änderungen werden auf dieser Seite veröffentlicht. Die fortgesetzte Nutzung der Website nach Veröffentlichung von Änderungen stellt eine Zustimmung zu den geänderten AGB dar.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Schlussbestimmungen</h2>
            <p className="text-gray-700 leading-relaxed">
              Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt. Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts.
            </p>
          </section>

          <section className="pt-8">
            <p className="text-sm text-gray-500">
              Stand: {new Date().toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
