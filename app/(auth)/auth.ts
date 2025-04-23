import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function auth() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  console.log('Auth Debug - Session:', {
    hasSession: !!session,
    userId: session?.user?.id,
    email: session?.user?.email,
  });

  // Get user data to verify against session
  const { data: { user } } = await supabase.auth.getUser();
  console.log('Auth Debug - User:', {
    hasUser: !!user,
    userId: user?.id,
    email: user?.email,
  });

  return session;
}

export async function signIn(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
