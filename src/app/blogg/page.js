import { getAllContent } from '@/lib/mdx';
import BlogListingClient from '@/components/blog/BlogListingClient';
import { Suspense } from 'react';
import StructuredData from '@/components/seo/StructuredData';
import { generateItemListSchema } from '@/lib/seo';

export const metadata = {
  title: 'Blogg - Matguider, Tips & Inspiration | Bakstunden',
  description: 'Utforska våra matguider, tips och inspiration för bättre matlagning. Lär dig nya tekniker, upptäck ingredienser och förbättra dina matlagningsfärdigheter.',
  keywords: 'matguider, matlagningstips, koktips, matlagningsinspiration, recepttips, kökstips, matblogg, svensk matlagning, bakningstips',
  openGraph: {
    title: 'Blogg | Bakstunden',
    description: 'Utforska våra matguider, tips och inspiration för bättre matlagning. Lär dig nya tekniker, upptäck ingredienser och förbättra dina matlagningsfärdigheter.',
    type: 'website',
    images: [
      {
        url: '/images/fika-och-bakning-svensk-stil.webp',
        width: 1200,
        height: 630,
        alt: 'Matguider och tips - Bakstunden',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blogg | Bakstunden',
    description: 'Utforska våra matguider, tips och inspiration för bättre matlagning.',
    images: ['/images/fika-och-bakning-svensk-stil.webp'],
  },
};

export default async function BlogPage() {
  // Load all blogs from MDX files
  const blogs = await getAllContent('blogg');

  // Generate structured data for blog listing
  const blogListSchema = generateItemListSchema(blogs.slice(0, 20), null, '/blogg');

  return (
    <>
      {/* Structured Data */}
      <StructuredData data={blogListSchema} />
      
      <Suspense>
        <BlogListingClient initialBlogs={blogs} />
      </Suspense>
    </>
  );
}















