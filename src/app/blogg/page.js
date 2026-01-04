import { getAllContent } from '@/lib/mdx';
import BlogListingClient from '@/components/blog/BlogListingClient';
import { Suspense } from 'react';
import StructuredData from '@/components/seo/StructuredData';
import { generateItemListSchema } from '@/lib/seo';

export const metadata = {
  title: 'Blog - Kochtipps, Guides & Inspiration | Kochera',
  description: 'Entdecke unsere Kochtipps, Guides und Inspiration für besseres Kochen. Lerne neue Techniken, entdecke Zutaten und verbessere deine Kochfähigkeiten.',
  keywords: 'Kochtipps, Kochguides, Rezepttipps, Kochinspiration, Küchentipps, Kochblog, deutsche Küche, Backtipps',
  openGraph: {
    title: 'Blog | Kochera',
    description: 'Entdecke unsere Kochtipps, Guides und Inspiration für besseres Kochen. Lerne neue Techniken, entdecke Zutaten und verbessere deine Kochfähigkeiten.',
    type: 'website',
    images: [
      {
        url: '/images/fika-och-bakning-svensk-stil.webp',
        width: 1200,
        height: 630,
        alt: 'Kochtipps und Guides - Kochera',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Kochera',
    description: 'Entdecke unsere Kochtipps, Guides und Inspiration für besseres Kochen.',
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















