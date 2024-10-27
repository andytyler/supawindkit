import { supabase } from '$lib/server/supabaseClient';
import { marked } from 'marked';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const { slug } = params;

  // Fetch blog post metadata
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !post) {
    throw error ?? new Error('Post not found');
  }

  // Fetch the Markdown content from storage
  const { data: fileData, error: fileError } = await supabase.storage
    .from('blog-posts')
    .download(post.storage_path);

  if (fileError || !fileData) {
    throw fileError ?? new Error('Failed to load post content');
  }

  const text = await fileData.text();
  const htmlContent = marked.parse(text);

  return {
    post,
    content: htmlContent
  };
};
