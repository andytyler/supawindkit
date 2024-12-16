// import { crawlWebsite, saveContent, searchSimilarContent } from '$lib/server/extrapolate/extrapolate-limited-md';
// import { fail } from '@sveltejs/kit';
// import { zod } from 'sveltekit-superforms/adapters';
// import { message, setError, superValidate } from 'sveltekit-superforms/server';

// import { z } from 'zod';
// import type { Actions, PageServerLoad } from './$types';


// const crawlFormSchema = z.object({
//   crawl_title: z
//     .string()
//     .min(1, "Title is required")
//     .refine((value) => !value.includes(" "), {
//       message: "Title must not contain spaces",
//     }),
//   input_url: z.string().url("Please enter a valid URL"),
//   depth: z.number().min(0).max(3),
// });

// const textFormSchema = z.object({
//   textTitle: z
//     .string()
//     .min(1, "Title is required")
//     .refine((value) => !value.includes(" "), {
//       message: "Title must not contain spaces",
//     }),
//   textContent: z.string().min(1, "Content is required"),
// });

// const searchFormSchema = z.object({
//   searchQuery: z
//     .string()
//     .min(1, "Search query is required"),
//   selectedTags: z.array(z.string()),
// });

// export const load: PageServerLoad = async ({ locals }) => {
//   try {
//     const { session } = await locals.safeGetSession();
//     const crawlForm = await superValidate(zod(crawlFormSchema), { id: 'crawl' } );
//     const textForm = await superValidate(zod(textFormSchema), { id: 'text' });
//     const searchForm = await superValidate(zod(searchFormSchema), { id: 'search' });
//     return { crawlForm, textForm, searchForm, session };
//   } catch (error) {
//     console.error('Error in page load:', error);
//     throw error;
//   }
// };

export const actions: Actions = {
  crawl: async ({ request, locals, url , cookies}) => {
    const formData = await request.formData();
    const parseResult = crawlFormSchema.safeParse({
      crawl_title: formData.get('crawl_title'),
      input_url: formData.get('input_url'),
      depth: Number(formData.get('depth')),
    });

    if (!parseResult.success) {
      return fail(400, { 
        crawl: { 
          errors: parseResult.error.flatten().fieldErrors,
          data: Object.fromEntries(formData)
        }
      });
    }

    const { user } = await locals.safeGetSession();
    if (!user) {
      return fail(401, { crawl: { error: 'Unauthorized' } });
    }

    try {
      await crawlWebsite(user, parseResult.data.input_url, parseResult.data.depth, parseResult.data.crawl_title);
      return { crawl: { success: 'Crawl completed successfully!' } };
    } catch (err) {
      console.error('Crawl error:', err);
      return fail(500, { crawl: { error: 'An error occurred while crawling the website.' } });
    }
  },

  text: async ({ request, locals }) => {
    const formData = await request.formData();
    const parseResult = textFormSchema.safeParse({
      textTitle: formData.get('textTitle'),
      textContent: formData.get('textContent'),
    });

    if (!parseResult.success) {
      return fail(400, { 
        text: { 
          errors: parseResult.error.flatten().fieldErrors,
          data: Object.fromEntries(formData)
        }
      });
    }

    const { user } = await locals.safeGetSession();
    if (!user) {
      return fail(401, { text: { error: 'Unauthorized' } });
    }

    try {
      await saveContent('text', parseResult.data.textContent, parseResult.data.textTitle, user.id);
      return { text: { success: 'Content saved successfully!' } };
    } catch (err) {
      console.error('Save error:', err);
      return fail(500, { text: { error: 'An error occurred while saving the content.' } });
    }
  },

  search: async ({ request, locals }) => {
    const formData = await request.formData();
    const parseResult = searchFormSchema.safeParse({
      searchQuery: formData.get('searchQuery'),
      selectedTags: formData.getAll('selectedTags'),
    });

    if (!parseResult.success) {
      return fail(400, { 
        search: { 
          errors: parseResult.error.flatten().fieldErrors,
          data: Object.fromEntries(formData)
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
        parseResult.data.searchQuery, 
        5, 
        parseResult.data.selectedTags
      );
      return { search_results, search: { success: true } };
    } catch (err) {
      console.error('Search error:', err);
      return fail(500, { search: { error: 'An error occurred while searching the content.' } });
    }
  }
};