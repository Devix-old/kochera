import { normalizeUrl } from '@/lib/utils/url';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import PillarHero from './PillarHero';
import QuickNavRail from './QuickNavRail';
import TippsSection from './TippsSection';
import VariantsSection from './VariantsSection';
import FlagshipRecipeCard from './FlagshipRecipeCard';
import PillarFAQ from './PillarFAQ';
import { PillarSocialSection, RelatedPillarsSection } from './PillarSEOSections';
import { generatePillarSchema, generatePillarBreadcrumbSchema, generatePillarFAQSchema, generatePillarHowToSchema } from '@/lib/seo/pillar-seo';
import { getRelatedPillars } from '@/lib/pillars';
import { getAllContent } from '@/lib/mdx';
import StructuredData from '@/components/seo/StructuredData';

/**
 * Main pillar page component with new structure:
 * 1. Semantic Hero (Top)
 * 2. Quick-Nav Rail (UX)
 * 3. Variants Section (Variants from MDX)
 * 4. Tipps Section (Tips matching recipe page design)
 * 5. Flagship Recipe Card
 * 6. FAQ & Troubleshooting Section
 * 7. Variations Grid (The Cluster) - Carousel
 * 8. Related Pillars
 */
export default async function PillarPage({ pillar }) {
  const { frontmatter, content, slug } = pillar;
  
  // Generate related content
  let relatedPillars = [];
  try {
    relatedPillars = await getRelatedPillars(slug, 3);
  } catch (error) {
    console.error('Error loading related pillars:', error);
    relatedPillars = [];
  }

  // Load variations if filterTag exists
  let variations = [];
  if (frontmatter.filterTag) {
    try {
      const allRecipes = await getAllContent('recipes');
      variations = allRecipes
        .filter(recipe => {
          const tags = recipe.tags || [];
          const category = recipe.category || '';
          const recipeName = (recipe.recipeName || recipe.title || '').toLowerCase();
          const filterLower = frontmatter.filterTag.toLowerCase();
          
          return tags.some(tag => tag.toLowerCase().includes(filterLower)) ||
                 category.toLowerCase().includes(filterLower) ||
                 recipeName.includes(filterLower);
        })
        .slice(0, 12);
    } catch (error) {
      console.error('Error loading variations:', error);
    }
  }

  // Generate breadcrumbs: Home > Topic (e.g., Pfannkuchen)
  const breadcrumbs = [
    { name: 'Startseite', url: '/' },
    { name: frontmatter.title }
  ];

  // Generate structured data
  const articleSchema = generatePillarSchema({
    ...frontmatter,
    slug,
    content
  });
  
  const breadcrumbSchema = generatePillarBreadcrumbSchema({
    ...frontmatter,
    slug
  });
  
  const faqSchema = frontmatter.faqs ? generatePillarFAQSchema(frontmatter.faqs) : null;

  // Extract introduction text (first 100-150 words from content or frontmatter)
  const introductionText = frontmatter.introductionText || 
    (content ? content.split('\n\n')[0].substring(0, 800) : frontmatter.excerpt);

  // Build sections for Quick Nav (from tipps sections)
  const tippsSections = frontmatter.tipps?.sections || [];
  const navSections = tippsSections.map((section, index) => ({
    id: `section-${index}`,
    title: section.title,
    label: section.label || section.title
  })).filter(section => section.title); // Only include sections with titles

  return (
    <>
      {/* Structured Data */}
      <StructuredData data={articleSchema} />
      <StructuredData data={breadcrumbSchema} />
      {faqSchema && <StructuredData data={faqSchema} />}

      {/* 1. Breadcrumbs: Home > Pfannkuchen */}
      <section className="bg-gray-50 dark:bg-gray-950 dark:border-gray-800 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbs.slice(1)} />
        </div>
      </section>

      {/* 2. Semantic Hero (Top) */}
      <PillarHero 
        pillar={frontmatter} 
        introductionText={introductionText}
      />

      {/* 3. Quick-Nav Rail (UX) - Sticky navigation */}
      {navSections.length > 0 && (
        <QuickNavRail sections={navSections} />
      )}

      {/* 4. Variants Section - Shows all related recipes */}
      {variations.length > 0 && (
        <VariantsSection 
          recipes={variations}
          pillarTitle={frontmatter.title}
          pillarDescription={frontmatter.introductionText}
        />
      )}

      {/* 5. Tipps Section (Matching Recipe Page Design) */}
      {frontmatter.tipps && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <TippsSection 
            pillar={frontmatter}
            tips={frontmatter.tipps.tips || []}
          />
        </div>
      )}

      {/* 6. Flagship Recipe Card */}
      {frontmatter.isFlagShip && frontmatter.flagshipRecipeSlug && (
        <FlagshipRecipeCard flagshipSlug={frontmatter.flagshipRecipeSlug} />
      )}

      {/* 7. FAQ & Troubleshooting Section */}
      {frontmatter.faqs && frontmatter.faqs.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-950 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <PillarFAQ 
              faqs={frontmatter.faqs} 
              title="Häufig gestellte Fragen"
              pillarTitle={frontmatter.title}
            />
          </div>
        </div>
      )}


      {/* 8. Social Sharing */}
      <PillarSocialSection pillar={{ ...frontmatter, slug }} />

      {/* 9. Related Pillars */}
      {relatedPillars.length > 0 && (
        <RelatedPillarsSection relatedPillars={relatedPillars} />
      )}
    </>
  );
}
