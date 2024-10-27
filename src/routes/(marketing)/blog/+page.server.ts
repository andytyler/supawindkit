import supabase from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('publish_date', { ascending: false });

  if (error) {
    throw error;
  }

  return { posts };
};
