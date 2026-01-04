import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Update comment status (approve, reject, spam)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, is_admin } = body;

    if (!status || !['pending', 'approved', 'spam'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be: pending, approved, or spam' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Validate ID is a valid UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'Invalid comment ID format', details: `ID: ${id} is not a valid UUID` },
        { status: 400 }
      );
    }

    const updateData: any = { status };
    if (is_admin !== undefined) {
      updateData.is_admin = is_admin;
    }

    const { data, error } = await supabase
      .from('comments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { 
          error: 'Failed to update comment', 
          details: error.message,
          code: error.code,
          hint: error.hint
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Comment updated successfully',
      comment: data 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete comment
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete comment', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Comment deleted successfully' 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

