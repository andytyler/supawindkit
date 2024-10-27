import supabase from '$lib/supabase';
import { askChatGPTNoStream } from '../../../(pages)/chat/llm';
import type { RequestHandler } from './$types';


// Define the system prompt for generating blog posts
const SYSTEM_PROMPT = `
You are an experienced blogger and web developer.
Generate a detailed blog post in Markdown format based on the provided topic.
Ensure the content is well-structured, engaging, and free of errors.
`;
const SYSTEM_PROMPT_TITLE = `
You are an experienced blogger and web developer.
Generate a unique blog post title based on the provided topic.
`;

// Handler for POST /generate
export const POST: RequestHandler = async ({ request }) => {
  try {
    const { number_of_blogs } = await request.json();

    if (
      typeof number_of_blogs !== 'number' ||
      number_of_blogs < 1 ||
      number_of_blogs > 10
    ) {
      return new Response(
        JSON.stringify({ error: 'Invalid number_of_blogs. Must be between 1 and 10.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let generatedBlogs = [];

    for (let i = 0; i < number_of_blogs; i++) {
      // Generate a blog title
      const { data: titleResponse } = await askChatGPTNoStream(
        SYSTEM_PROMPT_TITLE + '\n\nPlease provide a unique blog title.',
        ''
      );

      const title = titleResponse;
      console.log('🔑  Generating blog: ', title);

      // Generate the blog content
      const { data: contentResponse } = await askChatGPTNoStream(
        `${SYSTEM_PROMPT}\n\nTitle: ${title}\n\nPlease write a detailed blog post in Markdown format. No explanation, just go.`,
        ''
      );

      const markdownContent = contentResponse;

      // Generate slug
      const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

      // Check if the bucket exists, if not, create it
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      if (!buckets?.find(bucket => bucket.name === 'blog-posts')) {
        const { data, error } = await supabase.storage.createBucket('blog-posts', { public: false });
        if (error) {
          console.error('Error creating bucket:', error);
          return new Response(
            JSON.stringify({ error: `Failed to create bucket: ${error.message}` }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }
        console.log('Bucket "blog-posts" created successfully');
      } else {
        console.log('Bucket "blog-posts" already exists');
      }

      // Upload the Markdown file to Supabase Storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('blog-posts')
        .upload(`posts/${slug}.md`, new Blob([markdownContent ?? ''], { type: 'text/markdown' }), {
          upsert: true // This will overwrite the file if it already exists
        });

      if (storageError) {
        console.error('Error uploading file:', storageError);
        return new Response(
          JSON.stringify({ error: `Failed to upload file: ${storageError.message}` }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Insert metadata into the blog_posts table
      const { error: dbError } = await supabase.from('blog_posts').insert({
        title,
        slug,
        author: 'Automated Generator',
        storage_path: storageData.path,
      });

      if (dbError) {
        return new Response(
          JSON.stringify({ error: `Database insertion failed: ${dbError.message}` }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      generatedBlogs.push({ title, slug });
    }

    return new Response(JSON.stringify({ success: true, blogs: generatedBlogs }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in /generate endpoint:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
