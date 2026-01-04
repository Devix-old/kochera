/**
 * Server Component for rendering Schema.org structured data (JSON-LD)
 * This ensures search engines can see the structured data in the initial HTML
 */
export default function StructuredData({ data }) {
  if (!data || typeof data !== 'object') {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}
