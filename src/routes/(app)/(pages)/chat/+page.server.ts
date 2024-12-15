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

// export const actions: Actions = {
//   crawl: async ({ request, locals }) => {
//     const form = await superValidate(request, zod(crawlFormSchema), { id: 'crawl' });
//     if (!form.valid) {
//       return fail(400, { crawlForm: form });
//     }

//     const { user } = await locals.safeGetSession();
//     if (!user) {
//       return setError(form, '', 'Unauthorized');
//     }

//     try {
//       await crawlWebsite(user, form.data.input_url, form.data.depth, form.data.crawl_title);
//       return message(form, 'Crawl completed successfully!');
//     } catch (err) {
//       console.error('Crawl error:', err);
//       return setError(form, '', 'An error occurred while crawling the website.');
//     }
//   },

//   text: async ({ request, locals }) => {
//     const form = await superValidate(request, zod(textFormSchema), { id: 'text' });
//     if (!form.valid) {
//       return fail(400, { textForm: form });
//     }

//     const { user } = await locals.safeGetSession();
//     if (!user) {
//       return setError(form, '', 'Unauthorized');
//     }

//     try {
//       await saveContent('text',form.data.textContent,form.data.textTitle, user.id);
//       return message(form, 'Content saved successfully!');
//     } catch (err) {
//       console.error('Save error:', err);
//       return setError(form, '', 'An error occurred while saving the content.');
//     }
//   },

//   search: async ({ request, locals }) => {
//     const form = await superValidate(request, zod(searchFormSchema), { id: 'search' });
//     if (!form.valid) {
//       return fail(400, { searchForm: form });
//     }

//     const { user } = await locals.safeGetSession();
//     if (!user) {
//       return setError(form, '', 'Unauthorized');
//     }

//     try {
//       let search_results = await searchSimilarContent(user, form.data.searchQuery, 5, form.data.selectedTags.map(String));
//       return {form, search_results};
//     } catch (err) {
//       console.error('Search error:', err);
//       return setError(form, '', 'An error occurred while searching the content.');
//     }
//   }
// };
