import { MDXRemote } from 'next-mdx-remote/rsc';
import { normalizeUrl } from '@/lib/utils/url';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import PillarHero from './PillarHero';
import PillarContentBlock from './PillarContentBlock';
import PillarRecipeGrid from './PillarRecipeGrid';
import PillarFAQ from './PillarFAQ';
import PillarCTASection from './PillarCTASection';
import { PillarSocialSection, RelatedPillarsSection } from './PillarSEOSections';
import { generatePillarSchema, generatePillarBreadcrumbSchema, generatePillarFAQSchema, generatePillarHowToSchema } from '@/lib/seo/pillar-seo';
import { getRelatedPillars } from '@/lib/pillars';
import StructuredData from '@/components/seo/StructuredData';

/**
 * Main pillar page component
 * Renders pillar content with flexible section-based layout
 */
export default async function PillarPage({ pillar }) {
  const { frontmatter, content, slug } = pillar;
  
  // Generate related content (wrap in try-catch to prevent blocking)
  let relatedPillars = [];
  try {
    relatedPillars = await getRelatedPillars(slug, 3);
  } catch (error) {
    console.error('Error loading related pillars:', error);
    relatedPillars = [];
  }

  // Generate breadcrumbs
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Guides', url: '/guides' },
    ...(frontmatter.pillarTopic ? [
      { 
        name: frontmatter.pillarTopic, 
        url: `/guides?topic=${encodeURIComponent(frontmatter.pillarTopic)}` 
      }
    ] : []),
    { name: frontmatter.title }
  ];

  // Generate structured data
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kochera.de';
  
  // Determine schema type: Article or HowTo (if steps exist)
  const hasSteps = frontmatter.steps && Array.isArray(frontmatter.steps) && frontmatter.steps.length > 0;
  const articleSchema = generatePillarSchema({
    ...frontmatter,
    slug,
    content
  });
  
  const howToSchema = hasSteps ? generatePillarHowToSchema({
    ...frontmatter,
    slug
  }) : null;
  
  const breadcrumbSchema = generatePillarBreadcrumbSchema({
    ...frontmatter,
    slug
  });
  
  const faqSchema = frontmatter.faqs ? generatePillarFAQSchema(frontmatter.faqs) : null;

  // Process sections if defined in frontmatter
  // Filter out sections with placeholder/invalid data
  const sections = (frontmatter.sections || []).filter(section => {
    // Skip recipe-grid sections with placeholder slugs
    if (section.type === 'recipe-grid') {
      const validRecipes = (section.relatedRecipes || []).filter(
        slug => slug && !slug.includes('recipe-slug-')
      );
      return validRecipes.length > 0;
    }
    return true;
  });
  
  // If no valid sections defined, use default layout
  const useDefaultLayout = sections.length === 0;

  return (
    <>
      {/* Structured Data */}
      <StructuredData data={articleSchema} />
      {howToSchema && <StructuredData data={howToSchema} />}
      <StructuredData data={breadcrumbSchema} />
      {faqSchema && <StructuredData data={faqSchema} />}

      {/* Breadcrumb Section */}
      <section className="bg-gray-50 dark:bg-gray-950 dark:border-gray-800 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbs.slice(1)} />
        </div>
      </section>

      {/* Hero Section */}
      <PillarHero pillar={frontmatter} />

      {/* Main Content */}
      <article className="bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {useDefaultLayout ? (
            /* Default Layout: Render MDX content directly */
            <>
              {content && (
                <div className="prose prose-lg dark:prose-invert max-w-4xl mx-auto mb-12">
                  <MDXRemote source={content} />
                </div>
              )}
            </>
          ) : (
            /* Custom Layout: Render sections defined in frontmatter */
            <>
              {sections.map((section, index) => {
                // Hero is already rendered above, skip if present in sections
                if (section.type === 'hero') {
                  return null;
                }

                // Render recipe grid
                if (section.type === 'recipe-grid') {
                  return (
                    <PillarRecipeGrid
                      key={`section-${index}`}
                      recipeSlugs={section.relatedRecipes || []}
                      title={section.title || 'Related Recipes'}
                    />
                  );
                }

                // Render FAQ
                if (section.type === 'faq') {
                  return (
                    <PillarFAQ
                      key={`section-${index}`}
                      faqs={section.faqs || frontmatter.faqs || []}
                      title={section.title || 'Frequently Asked Questions'}
                    />
                  );
                }

                // Render CTA
                if (section.type === 'cta') {
                  return (
                    <PillarCTASection
                      key={`section-${index}`}
                      title={section.title}
                      description={section.description}
                      primaryAction={section.primaryAction}
                      secondaryAction={section.secondaryAction}
                    />
                  );
                }

                // Render content block (mdx, text, html)
                return (
                  <PillarContentBlock
                    key={`section-${index}`}
                    section={section}
                    index={index}
                  />
                );
              })}
            </>
          )}
        </div>
      </article>

      {/* FAQ Section (if using default layout and FAQs exist) */}
      {useDefaultLayout && frontmatter.faqs && frontmatter.faqs.length > 0 && (
        <PillarFAQ faqs={frontmatter.faqs} />
      )}

      {/* Social Sharing */}
      <PillarSocialSection pillar={{ ...frontmatter, slug }} />

      {/* Related Recipes (if defined in frontmatter) */}
      {frontmatter.relatedRecipes && frontmatter.relatedRecipes.length > 0 && (
        <PillarRecipeGrid
          recipeSlugs={frontmatter.relatedRecipes}
          title="Related Recipes"
        />
      )}

      {/* Related Pillars */}
      {relatedPillars.length > 0 && (
        <RelatedPillarsSection relatedPillars={relatedPillars} />
      )}

      {/* CTA Section */}
      <PillarCTASection
        title="Ready to Start Cooking?"
        description="Explore our collection of recipes and guides to improve your cooking skills."
        primaryAction={{ text: "Browse Recipes", href: "/rezepte" }}
        secondaryAction={{ text: "View All Guides", href: "/guides" }}
      />
    </>
  );
}
