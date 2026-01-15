import { generateMetadata as generateSiteMetadata } from '@/lib/seo';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kochera.de';

export const metadata = {
  ...generateSiteMetadata({
    title: 'Cookie-Richtlinie - Kochera',
    description: 'Informationen über die Verwendung von Cookies auf Kochera',
    url: '/cookie-policy',
  }),
  robots: {
    index: false,
    follow: false,
  },
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Cookie-Richtlinie</h1>
        
        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Was sind Cookies?</h2>
            <p className="text-gray-700 leading-relaxed">
              Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden, wenn Sie eine Website besuchen. Sie werden verwendet, um Informationen über Ihren Besuch zu speichern und die Funktionalität der Website zu verbessern.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Wie verwenden wir Cookies?</h2>
            <p className="text-gray-700 leading-relaxed">
              Kochera verwendet Cookies, um:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
              <li>Die Funktionalität der Website sicherzustellen</li>
              <li>Ihre Präferenzen zu speichern</li>
              <li>Die Nutzung der Website zu analysieren und zu verbessern</li>
              <li>Personalisierte Inhalte bereitzustellen</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Arten von Cookies</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Notwendige Cookies</h3>
            <p className="text-gray-700 leading-relaxed">
              Diese Cookies sind für das Funktionieren der Website unbedingt erforderlich. Sie ermöglichen grundlegende Funktionen wie Sicherheit und Zugriff auf geschützte Bereiche.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Funktionale Cookies</h3>
            <p className="text-gray-700 leading-relaxed">
              Diese Cookies ermöglichen es der Website, erweiterte Funktionalität und Personalisierung bereitzustellen. Sie können von uns oder von Drittanbietern gesetzt werden, deren Dienste wir auf unseren Seiten verwendet haben.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Analyse-Cookies</h3>
            <p className="text-gray-700 leading-relaxed">
              Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren, indem Informationen anonym gesammelt und gemeldet werden. Dies ermöglicht es uns, unsere Website zu verbessern.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Marketing-Cookies</h3>
            <p className="text-gray-700 leading-relaxed">
              Diese Cookies werden verwendet, um Besuchern auf verschiedenen Websites relevante Werbung und Marketingkampagnen bereitzustellen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookie-Verwaltung</h2>
            <p className="text-gray-700 leading-relaxed">
              Sie können Cookies in Ihren Browsereinstellungen verwalten und löschen. Bitte beachten Sie, dass die Deaktivierung von Cookies die Funktionalität unserer Website beeinträchtigen kann.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Weitere Informationen zum Verwalten von Cookies finden Sie in den Hilfedokumenten Ihres Browsers:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
              <li>Google Chrome</li>
              <li>Mozilla Firefox</li>
              <li>Microsoft Edge</li>
              <li>Safari</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Drittanbieter-Cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              Einige Cookies werden von Drittanbietern gesetzt, die Dienstleistungen auf unserer Website bereitstellen. Wir haben keinen direkten Zugriff auf diese Cookies. Bitte besuchen Sie die Websites dieser Drittanbieter für weitere Informationen zu deren Cookie-Richtlinien.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Änderungen dieser Cookie-Richtlinie</h2>
            <p className="text-gray-700 leading-relaxed">
              Wir können diese Cookie-Richtlinie von Zeit zu Zeit aktualisieren. Wir empfehlen Ihnen, diese Seite regelmäßig zu besuchen, um über Änderungen informiert zu bleiben.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Kontakt</h2>
            <p className="text-gray-700 leading-relaxed">
              Wenn Sie Fragen zu unserer Cookie-Richtlinie haben, können Sie uns unter kontakt@kochera.de kontaktieren.
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
