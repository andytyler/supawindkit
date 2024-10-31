import { saveContent } from '$lib/server/extrapolate/extrapolate-limited-md';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  const { user } = await locals.safeGetSession();
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { content, title } = await request.json();

    if (!content || !title) {
      return json(
        { error: 'Content and title are required' },
        { status: 400 }
      );
    }

    // Use the title as the URL for plain text content
    const url = `text-content://${title}`;
    
    await saveContent(url, content, title, user.id);

    return json({ success: true });
  } catch (error) {
    console.error('Error saving content:', error);
    return json(
      { error: 'An error occurred while saving the content.' },
      { status: 500 }
    );
  }
};
