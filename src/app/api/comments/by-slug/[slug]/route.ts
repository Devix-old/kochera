// Comments disabled for now
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function jsonNoCache(data: any) {
  return new NextResponse(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  // Comments disabled - return empty array
  return jsonNoCache({ comments: [] });
}
