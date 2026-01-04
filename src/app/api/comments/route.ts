import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { validateTurnstile, getClientIP } from '@/utils/turnstile';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { page_slug, author_name, author_email, content, parent_id, is_admin, 'cf-turnstile-response': turnstileToken } = body;

    // Validate Turnstile token (skip for admin comments)
    if (!is_admin) {
      if (!turnstileToken) {
        return NextResponse.json(
          { error: 'Verifiering krävs. Vänligen slutför säkerhetskontrollen.' },
          { status: 400 }
        );
      }

      const clientIP = getClientIP(request);
      const turnstileResult = await validateTurnstile(turnstileToken, clientIP);

      if (!turnstileResult.success) {
        const errorMessages: { [key: string]: string } = {
          'missing-input-secret': 'Säkerhetsvalidering misslyckades',
          'invalid-input-secret': 'Säkerhetsvalidering misslyckades',
          'missing-input-response': 'Verifiering krävs',
          'invalid-input-response': 'Ogiltig verifiering. Försök igen.',
          'bad-request': 'Ogiltig begäran',
          'timeout-or-duplicate': 'Verifieringen har gått ut. Uppdatera sidan och försök igen.',
          'internal-error': 'Verifiering misslyckades. Försök igen senare.',
        };

        const errorCode = turnstileResult['error-codes']?.[0] || 'internal-error';
        const errorMessage = errorMessages[errorCode] || 'Verifiering misslyckades. Försök igen.';

        return NextResponse.json(
          { error: errorMessage },
          { status: 400 }
        );
      }
    }

    // Validation
    if (!page_slug || !author_name || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: page_slug, author_name, and content are required' },
        { status: 400 }
      );
    }

    // Basic content validation
    if (content.trim().length < 3) {
      return NextResponse.json(
        { error: 'Comment must be at least 3 characters long' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // If is_admin is true, set status to 'approved', otherwise 'pending'
    const status = is_admin ? 'approved' : 'pending';

    // Insert comment
    const { data, error } = await supabase
      .from('comments')
      .insert({
        page_slug,
        author_name: author_name.trim(),
        author_email: author_email?.trim() || null,
        content: content.trim(),
        parent_id: parent_id || null,
        is_admin: is_admin || false,
        status,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to submit comment', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: is_admin 
          ? 'Admin reply submitted successfully.' 
          : 'Comment submitted successfully. It will be reviewed before being published.',
        comment: data 
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

