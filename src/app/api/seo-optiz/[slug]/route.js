import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Format file size in human readable format
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const contentDirectory = path.join(process.cwd(), 'content');

// Security: Only allow in development/localhost
function isLocalRequest(request) {
  const host = request.headers.get('host') || '';
  return host.includes('localhost') || host.includes('127.0.0.1') || process.env.NODE_ENV === 'development';
}

// Find file by slug across all directories
function findFileBySlug(slug) {
  const directories = ['recipes', 'articles', 'posts'];
  
  for (const dir of directories) {
    const filePath = path.join(contentDirectory, dir, `${slug}.mdx`);
    if (fs.existsSync(filePath)) {
      return { filePath, directory: dir };
    }
  }
  return null;
}

// Convert frontmatter object to YAML string
function stringifyFrontmatter(data) {
  const lines = [];
  const seenKeys = new Set(); // Track keys to prevent duplicates
  
  for (const [key, value] of Object.entries(data)) {
    // Skip null/undefined values and duplicate keys
    if (value === null || value === undefined) continue;
    if (seenKeys.has(key)) {
      continue;
    }
    seenKeys.add(key);
    
    if (Array.isArray(value)) {
      if (value.length === 0) {
        lines.push(`${key}: []`);
      } else {
        lines.push(`${key}:`);
        value.forEach(item => {
          if (typeof item === 'object') {
            lines.push(`  - ${JSON.stringify(item)}`);
          } else {
            lines.push(`  - "${String(item).replace(/"/g, '\\"')}"`);
          }
        });
      }
    } else if (typeof value === 'object' && value !== null) {
      // Handle nested objects
      if (Object.keys(value).length === 0) {
        lines.push(`${key}: {}`);
      } else {
        lines.push(`${key}:`);
        for (const [nestedKey, nestedValue] of Object.entries(value)) {
          if (typeof nestedValue === 'string') {
            lines.push(`  ${nestedKey}: "${String(nestedValue).replace(/"/g, '\\"')}"`);
          } else if (typeof nestedValue === 'number' || typeof nestedValue === 'boolean') {
            lines.push(`  ${nestedKey}: ${nestedValue}`);
          } else {
            lines.push(`  ${nestedKey}: "${JSON.stringify(nestedValue).replace(/"/g, '\\"')}"`);
          }
        }
      }
    } else if (typeof value === 'boolean') {
      lines.push(`${key}: ${value}`);
    } else if (typeof value === 'number') {
      lines.push(`${key}: ${value}`);
    } else {
      const str = String(value);
      // Handle ISO date strings - keep them as-is
      if (/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/.test(str)) {
        lines.push(`${key}: "${str}"`);
      } else if (str.includes('\n')) {
        lines.push(`${key}: |`);
        str.split('\n').forEach(line => {
          lines.push(`  ${line}`);
        });
      } else {
        lines.push(`${key}: "${str.replace(/"/g, '\\"')}"`);
      }
    }
  }
  
  return lines.join('\n');
}

export async function GET(request, { params }) {
  if (!isLocalRequest(request)) {
    return Response.json({ error: 'Not allowed' }, { status: 403 });
  }

  try {
    const { slug } = params;
    const fileInfo = findFileBySlug(slug);
    
    if (!fileInfo) {
      return Response.json({ error: 'File not found' }, { status: 404 });
    }
    
    const fileContents = fs.readFileSync(fileInfo.filePath, 'utf8');
    
    // Parse frontmatter - handle duplicate keys by keeping only the first occurrence
    let data, content;
    try {
      const parsed = matter(fileContents);
      data = parsed.data;
      content = parsed.content;
      
      // Remove duplicate keys from data object (keep first occurrence)
      const cleanedData = {};
      const seenKeys = new Set();
      for (const [key, value] of Object.entries(data)) {
        if (!seenKeys.has(key)) {
          cleanedData[key] = value;
          seenKeys.add(key);
        }
      }
      data = cleanedData;
    } catch (parseError) {
      // If parsing fails due to duplicate keys, try to fix it
      if (parseError.reason && parseError.reason.includes('duplicated mapping key')) {
        // Try to manually parse and remove duplicates
        const frontmatterMatch = fileContents.match(/^---\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
          const frontmatterText = frontmatterMatch[1];
          const lines = frontmatterText.split('\n');
          const seenKeys = new Set();
          const cleanedLines = [];
          
          for (const line of lines) {
            const keyMatch = line.match(/^(\w+):/);
            if (keyMatch) {
              const key = keyMatch[1];
              if (!seenKeys.has(key)) {
                cleanedLines.push(line);
                seenKeys.add(key);
              }
            } else {
              // Check if this is a continuation of previous key (indented)
              if (line.trim() && !line.match(/^\s/)) {
                cleanedLines.push(line);
              } else if (cleanedLines.length > 0) {
                // Keep indented lines (continuation of previous key)
                cleanedLines.push(line);
              }
            }
          }
          
          const cleanedFrontmatter = cleanedLines.join('\n');
          const cleanedFile = `---\n${cleanedFrontmatter}\n---${fileContents.substring(frontmatterMatch[0].length)}`;
          
          try {
            const parsed = matter(cleanedFile);
            data = parsed.data;
            content = parsed.content;
          } catch (e) {
            throw parseError; // Re-throw original error if fix didn't work
          }
        } else {
          throw parseError;
        }
      } else {
        throw parseError;
      }
    }
    
    // Check image file existence
    const imagesDirectory = path.join(process.cwd(), 'public', 'images', 'recipes');
    let imageMetadata = null;
    
    if (data?.image?.src) {
      try {
        let imagePath = data.image.src;
        if (imagePath.startsWith('/images/recipes/')) {
          imagePath = path.join(imagesDirectory, imagePath.replace('/images/recipes/', ''));
        } else if (imagePath.startsWith('/')) {
          imagePath = path.join(process.cwd(), 'public', imagePath);
        } else {
          imagePath = path.join(imagesDirectory, imagePath);
        }
        
        if (fs.existsSync(imagePath)) {
          const stats = fs.statSync(imagePath);
          imageMetadata = {
            exists: true,
            path: imagePath,
            size: stats.size,
            sizeFormatted: formatFileSize(stats.size),
            name: path.basename(imagePath),
            src: data.image.src,
          };
        } else {
          imageMetadata = {
            exists: false,
            name: path.basename(imagePath),
            src: data.image.src,
          };
        }
      } catch (error) {
        imageMetadata = {
          exists: false,
          error: error.message,
          src: data.image.src,
        };
      }
    }
    
    return Response.json({
      frontmatter: data,
      content,
      slug,
      path: fileInfo.filePath,
      directory: fileInfo.directory,
      imageMetadata,
    });
  } catch (error) {
    return Response.json({ 
      error: 'Failed to read file', 
      details: error.message,
      reason: error.reason 
    }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  if (!isLocalRequest(request)) {
    return Response.json({ error: 'Not allowed' }, { status: 403 });
  }

  try {
    const { slug } = params;
    const body = await request.json();
    const { frontmatter, content } = body;
    
    const fileInfo = findFileBySlug(slug);
    if (!fileInfo) {
      return Response.json({ error: 'File not found' }, { status: 404 });
    }
    
    // Read original file to preserve formatting where possible
    const originalContent = fs.readFileSync(fileInfo.filePath, 'utf8');
    const { content: originalMdxContent } = matter(originalContent);
    
    // Reconstruct MDX file with updated frontmatter
    const frontmatterString = stringifyFrontmatter(frontmatter);
    const newContent = `---\n${frontmatterString}\n---\n\n${content || originalMdxContent}`;
    
    // Write back to file
    fs.writeFileSync(fileInfo.filePath, newContent, 'utf8');
    
    return Response.json({ success: true, message: 'File updated successfully' });
  } catch (error) {
    return Response.json({ error: 'Failed to update file', details: error.message }, { status: 500 });
  }
}

