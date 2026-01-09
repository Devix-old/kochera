import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const INDEXNOW_API_URL = 'https://api.indexnow.org/IndexNow';
const MAX_URLS = 10000;
const BASE_URL = 'https://kochera.de';

interface IndexNowRequest {
  urls: string[];
}

interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

export async function POST(request: Request) {
  try {
    // Parse request body
    const body: IndexNowRequest = await request.json();
    const { urls } = body;

    // Validation: urls must be an array
    if (!Array.isArray(urls)) {
      return NextResponse.json(
        { error: 'urls must be an array' },
        { status: 400 }
      );
    }

    // Validation: max 10000 URLs
    if (urls.length > MAX_URLS) {
      return NextResponse.json(
        { error: `Maximum ${MAX_URLS} URLs allowed per request` },
        { status: 400 }
      );
    }

    // Validation: each URL must start with https://kochera.de/
    const invalidUrls = urls.filter(url => !url.startsWith(`${BASE_URL}/`));
    if (invalidUrls.length > 0) {
      return NextResponse.json(
        { 
          error: 'All URLs must start with https://kochera.de/',
          invalidUrls 
        },
        { status: 400 }
      );
    }

    // Get environment variables
    const host = process.env.INDEXNOW_HOST || 'kochera.de';
    const key = process.env.INDEXNOW_KEY;
    const keyLocation = process.env.INDEXNOW_KEY_LOCATION;

    // Validate required environment variables
    if (!key || !keyLocation) {
      return NextResponse.json(
        { error: 'IndexNow configuration is missing. Please check environment variables.' },
        { status: 500 }
      );
    }

    // Prepare payload for IndexNow API
    const payload: IndexNowPayload = {
      host,
      key,
      keyLocation,
      urlList: urls,
    };

    // POST to IndexNow API
    const response = await fetch(INDEXNOW_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Return response with upstream status code
    const responseData = await response.text().catch(() => null);
    
    return NextResponse.json(
      {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        submittedUrls: urls.length,
        ...(responseData ? { response: responseData } : {}),
      },
      { status: response.status }
    );

  } catch (error) {
    // Only log in development mode
    if (process.env.NODE_ENV === 'development') {
      console.error('IndexNow submission error:', error);
    }
    
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred while submitting URLs to IndexNow',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { status: 405 }
  );
}

