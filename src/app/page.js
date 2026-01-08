import { getAllContent } from '@/lib/mdx';
import EnhancedHomeClient from '@/components/EnhancedHomeClient';
import StructuredData from '@/components/seo/StructuredData';
import { generateWebsiteSchema, generateOrganizationSchema, generateItemListSchema } from '@/lib/seo';

export default async function Home() {
  // Load all recipes to calculate dynamic counts
  const allRecipes = await getAllContent('recipes');

  // Try to load authors (may not exist yet)
  let allAuthors = [];
  try {
    allAuthors = await getAllContent('authors');
  } catch (error) {
    // Authors don't exist yet, use empty array
    allAuthors = [];
  }

  // Get manually selected homepage featured recipes
  const featuredRecipes = allRecipes.filter(r => r.homepageFeatured === true);

  // Calculate tag counts dynamically
  const tagCounts = {};
  allRecipes.forEach(recipe => {
    if (recipe.tags) {
      recipe.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });

  // Get all categories and select the 12 most relevant ones for homepage
  const { getAllCategories } = await import('@/lib/categories');
  const allCategories = getAllCategories();
  
  // Select the 12 most relevant categories for homepage display
  const selectedCategoryKeys = [
    'pannkakor', 'kladdkaka', 'pasta', 'kyckling', 'vegetariska', 'vafflor',
    'appelpaj', 'chokladbollar', 'kycklingfars', 'lax', 'scones', 'lasagne'
  ];
  
  const popularCategories = selectedCategoryKeys.map(key => {
    const category = allCategories.find(cat => cat.slug === `${key}-recept`);
    return {
      name: category.name,
      slug: category.slug,
      image: category.image,
      icon: category.icon,
      description: category.description,
      count: `${tagCounts[category.name] || 0}+ recept`
    };
  });

  // Generate structured data
  const websiteSchema = generateWebsiteSchema();
  const organizationSchema = generateOrganizationSchema();
  // Do NOT pass 'Recipe' type - only recipe pages should have Recipe schema
  const recipeListSchema = generateItemListSchema(featuredRecipes.slice(0, 10));
  
  // Generate FAQ Schema for homepage
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Vilka typer av recept finns på Bakstunden?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `På Bakstunden hittar du över ${allRecipes.length} matrecept inom kategorier som frukost, lunch, middag, bakning och dessert. Vi har allt från pannkakor och våfflor till kycklingrecept, pasta, vegetariska rätter och klassisk svensk bakning som kladdkaka och chokladbollar.`
        }
      },
      {
        '@type': 'Question',
        name: 'Hur hittar jag enkla recept för vardagen?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Du kan filtrera recept på tid och svårighetsgrad för att hitta snabba middagar under 30 minuter. Filtrera på svårighetsgrad "Lätt" för att hitta enkla recept som passar nybörjare. Alla våra vardagsrecept är enkla att följa med tydliga instruktioner och tillgängliga ingredienser.'
        }
      },
      {
        '@type': 'Question',
        name: 'Finns det vegetariska och veganska recept?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ja! Vi har ett stort urval av vegetariska recept och veganska alternativ. Använd våra filter för att hitta vegetarisk mat, vegansk mat eller glutenfria recept. Vi visar hur du kan laga näringsrik och god mat utan animaliska produkter.'
        }
      },
      {
        '@type': 'Question',
        name: 'Vad gör Bakstundens recept speciella?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Alla våra svenska matrecept är noggrant testade och innehåller detaljerade steg-för-steg instruktioner, tydliga ingredienslistor, näringsinformation och praktiska tips. Vi fokuserar på hemlagad mat med ingredienser du hittar i svenska mataffärer.'
        }
      },
      {
        '@type': 'Question',
        name: 'Hur kan jag planera min veckomeny?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Använd våra olika kategorier för att skapa en varierad veckomeny. Blanda kycklingrecept, fiskrätter, pasta och vegetariska middagar för en balanserad kost. Välj några snabba vardagsrätter för stressiga dagar och planera en mer avancerad helgmiddag när du har mer tid.'
        }
      }
    ]
  };

  return (
    <>
      {/* Structured Data - Schema.org JSON-LD */}
      <StructuredData data={websiteSchema} />
      <StructuredData data={organizationSchema} />
      <StructuredData data={recipeListSchema} />
      <StructuredData data={faqSchema} />
      
      <EnhancedHomeClient
        popularCategories={popularCategories}
        totalRecipes={allRecipes.length}
        featuredRecipes={featuredRecipes}
        allRecipes={allRecipes}
        authors={allAuthors}
      />
    </>
  );
}
