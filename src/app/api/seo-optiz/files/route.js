import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export const dynamic = 'force-dynamic';

const contentDirectory = path.join(process.cwd(), 'content');
const imagesDirectory = path.join(process.cwd(), 'public', 'images', 'recipes');

// Security: Only allow in development/localhost
function isLocalRequest(request) {
  const host = request.headers.get('host') || '';
  return host.includes('localhost') || host.includes('127.0.0.1') || process.env.NODE_ENV === 'development';
}

/**
 * Check if image file exists and get its metadata
 */
function checkImageFile(imageSrc) {
  if (!imageSrc) return { exists: false, metadata: null };
  
  try {
    // Extract filename from src (could be "/images/recipes/file.webp" or just "file.webp")
    let imagePath = imageSrc;
    if (imageSrc.startsWith('/images/recipes/')) {
      imagePath = path.join(imagesDirectory, imageSrc.replace('/images/recipes/', ''));
    } else if (imageSrc.startsWith('/')) {
      // Handle other image paths
      imagePath = path.join(process.cwd(), 'public', imageSrc);
    } else {
      imagePath = path.join(imagesDirectory, imageSrc);
    }
    
    if (!fs.existsSync(imagePath)) {
      return { exists: false, metadata: null };
    }
    
    // Get file stats
    const stats = fs.statSync(imagePath);
    const fileSize = stats.size;
    
    // Try to get image dimensions (basic check for common formats)
    let width = null;
    let height = null;
    try {
      // For Node.js, we can read the file and check headers
      // This is a simplified version - for production, consider using sharp or jimp
      const buffer = fs.readFileSync(imagePath);
      
      // Check for WebP
      if (buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
        // WebP simple format
        if (buffer[12] === 'V' && buffer[13] === 'P' && buffer[14] === '8') {
          // VP8/VP8L format - skip header parsing for now
        }
      }
      
      // For now, we'll get dimensions from the API route when needed
    } catch (dimError) {
      // Dimensions will be fetched client-side
    }
    
    return {
      exists: true,
      metadata: {
        path: imagePath,
        size: fileSize,
        sizeFormatted: formatFileSize(fileSize),
        name: path.basename(imagePath),
        src: imageSrc,
      }
    };
  } catch (error) {
    return { exists: false, metadata: null, error: error.message };
  }
}

/**
 * Format file size in human readable format
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Calculate SEO issues/warnings for a file's frontmatter
 */
function analyzeFrontmatter(data, fallbackTitle, allRecipeNames = []) {
  try {
    const title = data?.title || fallbackTitle || '';
    const recipeName = data?.recipeName || '';
    const excerpt = data?.excerpt || '';
    const titleLength = title.length;
    const excerptLength = excerpt.length;

    const issues = [];
    const warnings = [];

    // Required fields
    if (!data?.title) issues.push('missing-title');
    if (!data?.excerpt) issues.push('missing-excerpt');
    if (!data?.slug) issues.push('missing-slug');
    if (!data?.category) issues.push('missing-category');
    if (!data?.publishedAt) issues.push('missing-publishedAt');
    if (!data?.updatedAt) issues.push('missing-updatedAt');

    // Title or excerpt length errors - combined into one issue type
    const hasTitleLengthError = titleLength > 0 && (titleLength < 50 || titleLength > 60);
    const hasExcerptLengthError = excerptLength > 0 && (excerptLength < 150 || excerptLength > 160);
    if (hasTitleLengthError || hasExcerptLengthError) {
      issues.push('title-or-excerpt-length-error');
    }

    // Check for missing image file
    if (data?.image?.src) {
      const imageCheck = checkImageFile(data.image.src);
      if (!imageCheck.exists) {
        issues.push('missing-image-file');
      }
    } else {
      warnings.push('no-hero-image');
    }

    // Check for duplicate recipe names
    if (recipeName && allRecipeNames.filter(name => name === recipeName).length > 1) {
      warnings.push('duplicate-recipe-name');
    }

    // Optional but valuable fields
    if (!data?.tags || (Array.isArray(data.tags) && data.tags.length === 0)) warnings.push('no-tags');
    if (!data?.author) warnings.push('no-author');

    return {
      title,
      recipeName,
      titleLength,
      excerptLength,
      issues,
      warnings,
      imageMetadata: data?.image?.src ? checkImageFile(data.image.src).metadata : null,
    };
  } catch (error) {
    return {
      title: fallbackTitle || '',
      recipeName: '',
      titleLength: 0,
      excerptLength: 0,
      issues: ['analysis-error'],
      warnings: [],
      imageMetadata: null,
    };
  }
}

/**
 * Get all MDX files from a directory
 */
function getContentFiles(type) {
  const dir = path.join(contentDirectory, type);
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs.readdirSync(dir).filter(file => file.endsWith('.mdx'));
}

export async function GET(request) {
  // Security check
  if (!isLocalRequest(request)) {
    return Response.json({ error: 'Not allowed' }, { status: 403 });
  }

  try {
    const files = [];
    const scanErrors = [];
    const directories = ['recipes', 'articles', 'posts'];
    
    // First pass: collect all recipe names for duplicate detection
    const allRecipeNames = [];
    const recipeDataMap = new Map();
    
    for (const dir of directories) {
      try {
        const dirFiles = getContentFiles(dir);
        
        for (const file of dirFiles) {
          const slug = file.replace(/\.mdx$/, '');
          const filePath = path.join(contentDirectory, dir, file);

          try {
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const { data } = matter(fileContents);
            
            if (dir === 'recipes' && data?.recipeName) {
              allRecipeNames.push(data.recipeName);
            }
            recipeDataMap.set(`${dir}/${slug}`, data);
          } catch (fileError) {
            // Skip error collection for first pass
          }
        }
      } catch (dirError) {
        // Skip for first pass
      }
    }

    // Second pass: analyze with duplicate detection
    for (const dir of directories) {
      try {
        const dirFiles = getContentFiles(dir);
        
        for (const file of dirFiles) {
          const slug = file.replace(/\.mdx$/, '');
          const filePath = path.join(contentDirectory, dir, file);

          try {
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const { data } = matter(fileContents);

            const analysis = analyzeFrontmatter(data, slug, allRecipeNames);
            
            files.push({
              slug,
              filename: file,
              path: `${dir}/${file}`,
              title: analysis.title || slug,
              recipeName: analysis.recipeName || '',
              directory: dir,
              titleLength: analysis.titleLength,
              excerptLength: analysis.excerptLength,
              issues: analysis.issues,
              warnings: analysis.warnings,
              issueCount: analysis.issues.length,
              warningCount: analysis.warnings.length,
              hasIssues: analysis.issues.length > 0,
              hasWarnings: analysis.warnings.length > 0,
              imageMetadata: analysis.imageMetadata,
            });
          } catch (fileError) {
            scanErrors.push({ 
              file: `${dir}/${file}`, 
              message: fileError.message,
              stack: fileError.stack 
            });

            // Still add file to list with error status
            files.push({
              slug,
              filename: file,
              path: `${dir}/${file}`,
              title: slug,
              directory: dir,
              titleLength: slug.length,
              excerptLength: 0,
              issues: ['parse-error'],
              warnings: [],
              issueCount: 1,
              warningCount: 0,
              hasIssues: true,
              hasWarnings: false,
              errorMessage: fileError.message,
            });
          }
        }
      } catch (dirError) {
        scanErrors.push({ 
          directory: dir, 
          message: dirError.message 
        });
      }
    }

    return Response.json({ 
      files, 
      errors: scanErrors,
      total: files.length,
      withErrors: scanErrors.length
    });
  } catch (error) {
    return Response.json({ 
      error: 'Failed to read files', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      files: [],
      errors: []
    }, { status: 500 });
  }
}
