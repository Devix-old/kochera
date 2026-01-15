import { generateMetadata as generateSiteMetadata } from '@/lib/seo';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kochira.de';

export const metadata = {
  ...generateSiteMetadata({
    title: 'Impressum - kochira',
    description: 'Impressum und rechtliche Informationen zu kochira',
    url: '/impressum',
  }),
  robots: {
    index: true,
    follow: true,
  },
};

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Impressum</h1>
        
        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Angaben gemäß § 5 TMG</h2>
            <p className="text-gray-700 leading-relaxed">
            Nina Albrecht<br />
              Gertrudenstraße 10<br />
              41236 Mönchengladbach<br />
              Deutschland
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Kontakt</h2>
            <p className="text-gray-700 leading-relaxed">
              Telefon: 0176 20000000<br />
              E-Mail: info@kochira.de
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p className="text-gray-700 leading-relaxed">
              kochira<br />
              [Ihre Straße]<br />
              [Ihre PLZ] [Ihr Ort]<br />
              Deutschland
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Haftung für Inhalte</h2>
            <p className="text-gray-700 leading-relaxed">
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Haftung für Links</h2>
            <p className="text-gray-700 leading-relaxed">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Urheberrecht</h2>
            <p className="text-gray-700 leading-relaxed">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Haftungsausschluss für Rezepte und kulinarische Inhalte</h2>
            <p className="text-gray-700 leading-relaxed">
              Die auf kochira bereitgestellten Rezepte und kulinarischen Informationen dienen ausschließlich zu Informationszwecken. Die Verwendung dieser Rezepte erfolgt auf eigene Verantwortung des Nutzers. kochira übernimmt keine Haftung für:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-700">
              <li>Allergische Reaktionen oder gesundheitliche Schäden, die durch die Verwendung von Rezepten oder Zutaten entstehen</li>
              <li>Krankheiten oder gesundheitliche Probleme, die durch die Zubereitung oder den Verzehr von Gerichten verursacht werden</li>
              <li>Schäden an Küchengeräten, Eigentum oder Personen bei der Zubereitung von Rezepten</li>
              <li>Ungenaue oder unvollständige Angaben zu Zutaten, Mengen oder Zubereitungszeiten</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Nutzer mit Allergien, Unverträglichkeiten oder besonderen Ernährungsanforderungen sollten vor der Verwendung von Rezepten einen Arzt oder Ernährungsberater konsultieren.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Keine medizinische oder ernährungsphysiologische Beratung</h2>
            <p className="text-gray-700 leading-relaxed">
              Die auf kochira bereitgestellten Informationen und Rezepte stellen keine medizinische, ernährungsphysiologische oder diätetische Beratung dar. Sie ersetzen nicht die Beratung durch einen Arzt, Ernährungsberater oder andere qualifizierte Fachpersonen. Bei gesundheitlichen Fragen oder Problemen sollten Sie immer einen Arzt konsultieren.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
