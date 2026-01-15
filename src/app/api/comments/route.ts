// Comments disabled for now
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Comments disabled - return error
  return NextResponse.json(
    { error: 'Comments are currently disabled' },
    { status: 503 }
  );
}

