import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const imagesDirectory = path.join(process.cwd(), 'public', 'images', 'recipes');

// Security: Only allow in development/localhost
function isLocalRequest(request) {
  const host = request.headers.get('host') || '';
  return host.includes('localhost') || host.includes('127.0.0.1') || process.env.NODE_ENV === 'development';
}

export async function POST(request) {
  if (!isLocalRequest(request)) {
    return Response.json({ error: 'Not allowed' }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const imageFile = formData.get('image');
    const oldImageSrc = formData.get('oldImageSrc') || '';
    const oldImageName = formData.get('oldImageName') || '';
    const newExtension = formData.get('newExtension') || '';

    if (!imageFile || !(imageFile instanceof File)) {
      return Response.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Determine the new filename
    let newImageName;
    if (oldImageName && newExtension) {
      // Use old image name with new extension
      newImageName = `${oldImageName}.${newExtension}`;
    } else if (oldImageSrc) {
      // Extract name from old path and use new extension
      const oldName = oldImageSrc.split('/').pop().replace(/\.[^/.]+$/, '');
      const ext = newExtension || imageFile.name.split('.').pop();
      newImageName = `${oldName}.${ext}`;
    } else {
      // Fallback to original filename
      newImageName = imageFile.name;
    }

    const newImagePath = path.join(imagesDirectory, newImageName);
    const newImageSrc = `/images/recipes/${newImageName}`;

    // Ensure directory exists
    if (!fs.existsSync(imagesDirectory)) {
      fs.mkdirSync(imagesDirectory, { recursive: true });
    }

    // If old image exists and has different name, delete it
    if (oldImageSrc) {
      try {
        const oldImagePath = oldImageSrc.startsWith('/images/recipes/')
          ? path.join(imagesDirectory, oldImageSrc.replace('/images/recipes/', ''))
          : path.join(imagesDirectory, oldImageSrc);

        if (fs.existsSync(oldImagePath) && oldImagePath !== newImagePath) {
          fs.unlinkSync(oldImagePath);
        }
      } catch (deleteError) {
        // Silently continue if old file can't be deleted
      }
    }

    // Convert File to Buffer and save
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Write new file
    await writeFile(newImagePath, buffer);

    return Response.json({
      success: true,
      newImagePath: newImageSrc,
      newImageName: newImageName,
      message: 'Image uploaded and replaced successfully',
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

