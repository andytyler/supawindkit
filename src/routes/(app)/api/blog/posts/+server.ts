import { supabase } from '$lib/server/supabaseClient';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('publish_date', { ascending: false });

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }

  return json({ posts: data });
};
