// Comments disabled for now
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Update comment status (approve, reject, spam)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Comments disabled
  return NextResponse.json(
    { error: 'Comments are currently disabled' },
    { status: 503 }
  );
}

// Delete comment
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Comments disabled
  return NextResponse.json(
    { error: 'Comments are currently disabled' },
    { status: 503 }
  );
}

