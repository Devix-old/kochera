import { supabaseAdmin } from '@/utils/supabase/admin';
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
  try {
    const { slug } = await params;

    const { data: comments, error } = await supabaseAdmin
      .from('comments')
      .select('*')
      .eq('page_slug', slug)
      .eq('status', 'approved')
      .order('created_at', { ascending: true });

    if (error || !comments) {
      return jsonNoCache({ comments: [] });
    }

    // Build tree structure
    const map = new Map();
    const roots: any[] = [];

    comments.forEach((c) => map.set(c.id, { ...c, replies: [] }));
    comments.forEach((c) => {
      const current = map.get(c.id);
      if (c.parent_id && map.has(c.parent_id)) {
        map.get(c.parent_id).replies.push(current);
      } else {
        roots.push(current);
      }
    });

    return jsonNoCache({ comments: roots });
  } catch {
    return jsonNoCache({ comments: [] });
  }
}
