import { getContentBySlug, getAllContent, getRelatedContent } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { normalizeUrl } from '@/lib/utils/url';
import {
  Calendar,
  Clock,
  BookOpen,
  ArrowLeft,
  Share2,
  Tag as TagIcon
} from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Tag from '@/components/ui/Tag';
import BlogCard from '@/components/blog/BlogCard';
import ShareButton from '@/components/recipe/ShareButton';
import { generateArticleSchema } from '@/lib/seo';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import Billboard_970x250 from '@/components/ads/Billboard_970x250';
// Generate static params
export async function generateStaticParams() {
  const blogs = await getAllContent('blogg');
  return blogs.map((blog) => ({ slug: blog.slug }));
}

// Generate comprehensive metadata
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blogData = await getContentBySlug('blogg', slug);

  if (!blogData) return { title: 'Artikel hittades inte' };

  const blog = {
    ...blogData.frontmatter,
    slug: blogData.slug,
    content: blogData.content
  };

  return generateSEOMetadata({
    title: blog.title,
    description: blog.excerpt || blog.description,
    image: blog.image?.src || blog.image,
    url: `/blogg/${slug}`,
    type: 'article',
    publishedTime: blog.publishedAt,
    modifiedTime: blog.updatedAt || blog.publishedAt,
    author: blog.author || 'Kochera Team',
    tags: blog.tags,
    keywords: blog.tags?.join(', ') || blog.keywords,
  });
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const blog = await getContentBySlug('blogg', slug);

  if (!blog) notFound();

  const { frontmatter, content } = blog;
  
  // Get related content
  const relatedBlogs = await getRelatedContent(
    'blogg',
    slug,
    frontmatter.tags,
    frontmatter.category,
    6
  );

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Calculate reading time
  const getReadingTime = (content) => {
    if (!content) return 5;
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const readingTime = getReadingTime(content);

  // Generate breadcrumbs
  const breadcrumbs = [
    { name: 'Hem', url: '/' },
    { name: 'Blogg', url: '/blogg' },
    { name: frontmatter.title }
  ];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kochera.de';
  
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url ? normalizeUrl(siteUrl, item.url) : undefined,
    })),
  };

  // Generate Article schema
  const articleSchema = generateArticleSchema({
    title: frontmatter.title,
    excerpt: frontmatter.excerpt,
    image: frontmatter.image,
    author: frontmatter.author || 'Kochera Team',
    publishedAt: frontmatter.publishedAt,
    updatedAt: frontmatter.updatedAt || frontmatter.publishedAt,
    url: normalizeUrl(siteUrl, `/blogg/${slug}`),
  });

  // Generate WebPage schema with primaryImageOfPage
  const webpageUrl = normalizeUrl(siteUrl, `/blogg/${slug}`);
  const webpageId = `${webpageUrl}#webpage`;
  const primaryImageId = `${webpageUrl}#primaryimage`;
  
  // Normalize image URL
  const imageUrl = frontmatter.image?.src
    ? (frontmatter.image.src.startsWith('http') 
        ? frontmatter.image.src 
        : normalizeUrl(siteUrl, frontmatter.image.src))
    : null;

  // Create ImageObject for primaryImageOfPage
  const primaryImageObject = imageUrl ? {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    '@id': primaryImageId,
    url: imageUrl,
    contentUrl: imageUrl,
    inLanguage: 'sv-SE',
    ...(frontmatter.image?.width && frontmatter.image?.height ? {
      width: frontmatter.image.width,
      height: frontmatter.image.height,
    } : {
      width: 1200,
      height: 630,
    }),
    ...(frontmatter.image?.alt ? { caption: frontmatter.image.alt } : {}),
  } : null;

  // Generate WebPage schema
  const webpageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': webpageId,
    url: webpageUrl,
    name: frontmatter.title,
    description: frontmatter.excerpt,
    ...(primaryImageObject ? { primaryImageOfPage: { '@id': primaryImageId } } : {}),
    inLanguage: 'sv-SE',
  };

  return (
    <>
      {/* Add image_src link tag for better social media image recognition */}
      {frontmatter.image?.src && (
        <link 
          href={normalizeUrl(siteUrl, frontmatter.image.src)} 
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }}
      />
      {primaryImageObject && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(primaryImageObject) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Billboard_970x250 />
      {/* 🧭 BREADCRUMB SECTION */}
      <section className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { name: 'Blogg', url: '/blogg' },
              { name: frontmatter.title },
            ]}
          />
        </div>
      </section>

      {/* 📝 MAIN BLOG CONTENT */}
      <article className="bg-gray-50 dark:bg-gray-950 pb-12">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          {/* Header Section */}
          <header className="mb-12">
            {frontmatter.category && (
              <div className="mb-4">
                <Tag variant="accent" size="md">
                  {frontmatter.category}
                </Tag>
              </div>
            )}
            
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white leading-tight"
              style={{ 
                fontFamily: 'var(--font-crimson)', 
                letterSpacing: '-0.01em' 
              }}
            >
              {frontmatter.title}
            </h1>

            {frontmatter.excerpt && (
              <p 
                className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
                style={{ fontFamily: 'var(--font-lora)' }}
              >
                {frontmatter.excerpt}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
              {frontmatter.publishedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(frontmatter.publishedAt)}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{readingTime} min läsning</span>
              </div>
              {frontmatter.author && (
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{frontmatter.author}</span>
                </div>
              )}
            </div>

            {/* Share Button */}
            <div className="mb-8">
              <ShareButton 
                title={frontmatter.title}
                excerpt={frontmatter.excerpt}
                url={normalizeUrl(siteUrl, `/blogg/${slug}`)}
              />
            </div>
          </header>

          {/* Featured Image */}
          {frontmatter.image?.src && (
            <div className="mb-12">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl ring-2 ring-purple-100 dark:ring-purple-900/50 shadow-lg">
                <img
                  src={frontmatter.image.src}
                  alt={frontmatter.image.alt || frontmatter.title}
                  width="1200"
                  height="675"
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          )}

          {/* Blog Content */}
          {content && (
            <div className="prose prose-lg dark:prose-invert max-w-none mb-12 blog-content">
              <MDXRemote 
                source={content}
                components={{
                  a: ({ href, children, ...props }) => {
                    // Check if it's an internal link
                    if (href && (href.startsWith('/') || href.startsWith('#') || !href.startsWith('http'))) {
                      return (
                        <Link
                          href={href}
                          className="text-purple-600 dark:text-purple-400 underline hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
                          {...props}
                        >
                          {children}
                        </Link>
                      );
                    }
                    // External links
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 dark:text-purple-400 underline hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
                        {...props}
                      >
                        {children}
                      </a>
                    );
                  },
                }}
              />
            </div>
          )}

          {/* Tags */}
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <div className="mb-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <TagIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Taggar:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {frontmatter.tags.map((tag) => (
                  <Tag key={tag} size="md">
                    {tag}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          {/* Related Blogs */}
          {relatedBlogs.length > 0 && (
            <section className="pt-12 border-t border-gray-200 dark:border-gray-800">
              <h2
                className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 dark:text-white"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Relaterade artiklar
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedBlogs.map((b, i) => (
                  <BlogCard key={`${b.slug}-${i}`} blog={b} index={i} />
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  );
}



