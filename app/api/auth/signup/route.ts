
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = createRouteHandlerClient({ cookies });

  const { data, error } = await supabase.auth.signUp({
    email: body.email,
    password: body.password,
  });

  if (error || !data.user) {
    return NextResponse.json({ error: error?.message || 'Gagal signup' }, { status: 400 });
  }

  const { error: profileError } = await supabase.from('profiles').insert({
    id: data.user.id,
    full_name: body.fullName,
    username: body.username
  });

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Signup berhasil' });
}
