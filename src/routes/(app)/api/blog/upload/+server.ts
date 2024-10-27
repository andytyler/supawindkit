import supabase from '$lib/supabase';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.formData();
  const title = data.get('title') as string;
  const author = data.get('author') as string;
  const markdownFile = data.get('file') as File;

  // Generate a slug
  const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  // Upload the Markdown file to Supabase Storage
  const { data: storageData, error: storageError } = await supabase.storage
    .from('blog-posts')
    .upload(`posts/${slug}.md`, markdownFile);

  if (storageError) {
    return json({ error: storageError.message }, { status: 500 });
  }

  // Insert metadata into the blog_posts table
  const { error: dbError } = await supabase.from('blog_posts').insert({
    title,
    slug,
    author,
    storage_path: storageData.path
  });

  if (dbError) {
    return json({ error: dbError.message }, { status: 500 });
  }

  return json({ success: true, slug });
};
