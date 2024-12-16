import { crawlWebsite, saveContent, searchSimilarContent } from '$lib/server/extrapolate/extrapolate-limited-md';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  try {
    const { session } = await locals.safeGetSession();
    // Return session if needed
  } catch (error) {
    console.error('Error in page load:', error);
    throw error;
  }
};

// Simple validation functions
const validateCrawlForm = (data: { crawl_title: string; input_url: string; depth: number }) => {
  const errors: Record<string, string> = {};
  
  if (!data.crawl_title) errors.crawl_title = "Title is required";
  if (data.crawl_title?.includes(" ")) errors.crawl_title = "Title must not contain spaces";
  if (!data.input_url) errors.input_url = "URL is required";
  if (!isValidUrl(data.input_url)) errors.input_url = "Please enter a valid URL";
  if (data.depth < 0 || data.depth > 3) errors.depth = "Depth must be between 0 and 3";

  return { isValid: Object.keys(errors).length === 0, errors };
};

const validateTextForm = (data: { textTitle: string; textContent: string }) => {
  const errors: Record<string, string> = {};
  
  if (!data.textTitle) errors.textTitle = "Title is required";
  if (data.textTitle?.includes(" ")) errors.textTitle = "Title must not contain spaces";
  if (!data.textContent) errors.textContent = "Content is required";

  return { isValid: Object.keys(errors).length === 0, errors };
};

const validateSearchForm = (data: { searchQuery: string; selectedTags: string[] }) => {
  const errors: Record<string, string> = {};
  
  if (!data.searchQuery) errors.searchQuery = "Search query is required";

  return { isValid: Object.keys(errors).length === 0, errors };
};

// Helper function to validate URLs
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const actions: Actions = {
  crawl: async ({ request, locals }) => {
    const formData = await request.formData();
    const data = {
      crawl_title: formData.get('crawl_title') as string,
      input_url: formData.get('input_url') as string,
      depth: Number(formData.get('depth')),
    };

    const validation = validateCrawlForm(data);
    if (!validation.isValid) {
      return fail(400, {
        crawl: {
          errors: validation.errors,
          data
        }
      });
    }

    const { user } = await locals.safeGetSession();
    if (!user) {
      return fail(401, { crawl: { error: 'Unauthorized' } });
    }

    try {
      await crawlWebsite(user, data.input_url, data.depth, data.crawl_title);
      return { crawl: { success: 'Crawl completed successfully!' } };
    } catch (err) {
      console.error('Crawl error:', err);
      return fail(500, { crawl: { error: 'An error occurred while crawling the website.' } });
    }
  },

  text: async ({ request, locals }) => {
    const formData = await request.formData();
    const data = {
      textTitle: formData.get('textTitle') as string,
      textContent: formData.get('textContent') as string,
    };

    const validation = validateTextForm(data);
    if (!validation.isValid) {
      return fail(400, {
        text: {
          errors: validation.errors,
          data
        }
      });
    }

    const { user } = await locals.safeGetSession();
    if (!user) {
      return fail(401, { text: { error: 'Unauthorized' } });
    }

    try {
      await saveContent('text', data.textContent, data.textTitle, user.id);
      return { text: { success: 'Content saved successfully!' } };
    } catch (err) {
      console.error('Save error:', err);
      return fail(500, { text: { error: 'An error occurred while saving the content.' } });
    }
  },

  search: async ({ request, locals }) => {
    const formData = await request.formData();
    const data = {
      searchQuery: formData.get('searchQuery') as string,
      selectedTags: formData.getAll('selectedTags') as string[],
    };

    const validation = validateSearchForm(data);
    if (!validation.isValid) {
      return fail(400, {
        search: {
          errors: validation.errors,
          data
        }
      });
    }

    const { user } = await locals.safeGetSession();
    if (!user) {
      return fail(401, { search: { error: 'Unauthorized' } });
    }

    try {
      const search_results = await searchSimilarContent(
        user,
        data.searchQuery,
        5,
        data.selectedTags
      );
      return { search_results, search: { success: true } };
    } catch (err) {
      console.error('Search error:', err);
      return fail(500, { search: { error: 'An error occurred while searching the content.' } });
    }
  }
};