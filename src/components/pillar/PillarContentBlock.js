import { MDXRemote } from 'next-mdx-remote/rsc';

/**
 * Flexible content block for pillar pages
 * Can render MDX content, plain text, or structured sections
 */
export default function PillarContentBlock({ section, index = 0 }) {
  const { type, title, content, className } = section;

  // Render MDX content
  if (type === 'mdx' && typeof content === 'string') {
    return (
      <section 
        className={`prose prose-lg dark:prose-invert max-w-none ${className || ''}`}
        id={`section-${index}`}
      >
        <div className="pillar-mdx-content">
          <MDXRemote source={content} />
        </div>
      </section>
    );
  }

  // Render text content
  if (type === 'text' || type === 'content-block') {
    return (
      <section 
        className={`py-8 ${className || ''}`}
        id={`section-${index}`}
      >
        <div className="max-w-4xl mx-auto">
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {title}
            </h2>
          )}
          {typeof content === 'string' ? (
            <div 
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {content}
            </div>
          )}
        </div>
      </section>
    );
  }

  // Render custom HTML
  if (type === 'html') {
    return (
      <section 
        className={className || ''}
        id={`section-${index}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Default: render as simple section
  return (
    <section 
      className={`py-8 ${className || ''}`}
      id={`section-${index}`}
    >
      <div className="max-w-4xl mx-auto">
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            {title}
          </h2>
        )}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {content}
        </div>
      </div>
    </section>
  );
}
