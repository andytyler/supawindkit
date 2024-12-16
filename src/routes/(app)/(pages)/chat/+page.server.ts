import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';



const crawlFormSchema = z.object({
  crawl_title: z
    .string()
    .min(1, "Title is required")
    .refine((value) => !value.includes(" "), {
      message: "Title must not contain spaces",
    }),
  input_url: z.string().url("Please enter a valid URL"),
  depth: z.number().min(0).max(3),
});

  const textFormSchema = z.object({
    textTitle: z
      .string()
      .min(1, "Title is required")
      .refine((value) => !value.includes(" "), {
        message: "Title must not contain spaces",
      }),
    textContent: z.string().min(1, "Content is required"),
  });

// const searchFormSchema = z.object({
//   searchQuery: z
//     .string()
//     .min(1, "Search query is required"),
//   selectedTags: z.array(z.string()),
// });

export const load: PageServerLoad = async ({ locals }) => {
  try {
    console.log('Page load called');
    // const { session } = await locals.safeGetSession();
    const crawlForm = await superValidate(zod(crawlFormSchema), { id: 'crawl' } );
    const textForm = await superValidate(zod(textFormSchema));
    // const searchForm = await superValidate(zod(searchFormSchema), { id: 'search' });
    // return { crawlForm, textForm, searchForm, session };
    return { crawlForm, textForm };
  } catch (error) {
    console.error('Error in page load:', error);
    throw error;
  }
};

export const actions: Actions = {
  crawl: async ({ request, locals, fetch  }) => {
    console.log('Crawl action called');
    const crawlForm = await superValidate(request, zod(crawlFormSchema));

    if (!crawlForm.valid) {
      return fail(400, { crawlForm });
    }

    const { user } = await locals.safeGetSession();
    if (!user) {
      return fail(401, { crawlForm });
    }

    try {
      const response = await fetch('/api/crawl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input_url: crawlForm.data.input_url,
          crawl_title: crawlForm.data.crawl_title,
          depth: crawlForm.data.depth
        })
      });

      if (!response.ok) {
        throw new Error('Failed to crawl website');
      }

      return message(crawlForm, 'Website crawled successfully!');
    } catch (err) {
      console.error('Crawl error:', err);
      return fail(500, { crawlForm });
    }
  },

  text: async ({ request, locals, fetch }) => {
    console.log('Text action called');
    const textForm = await superValidate(request, zod(textFormSchema));

    // const formData = await request.formData();
    // console.log(formData);

    // const parseResult = textFormSchema.safeParse({
    //   textTitle: formData.get('textTitle'),
    //   textContent: formData.get('textContent'),
    // });

    if (!textForm.valid) {
      return fail(400, { textForm });
    }

    const { user } = await locals.safeGetSession();
    if (!user) {
      return fail(401, { textForm });
    }

    try {
      const response = await fetch('/api/add-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: textForm.data.textContent,
          title: textForm.data.textTitle
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save content');
      }
      console.log('FAKING THE TEXT SAVE');
      return message(textForm, 'Text saved successfully!');
    } catch (err) {
      console.error('Save error:', err);
      return fail(500, { textForm });
    }
  },

  search: async ({ request, locals, fetch }) => {
    console.log('Search action called');
    // const formData = await request.formData();
    // const parseResult = searchFormSchema.safeParse({
    //   searchQuery: formData.get('searchQuery'),
    //   selectedTags: formData.getAll('selectedTags'),
    // });

    // if (!parseResult.success) {
    //   return fail(400, { 
    //     search: { 
    //       errors: parseResult.error.flatten().fieldErrors,
    //       data: Object.fromEntries(formData)
    //     }
    //   });
    // }

    // const { user } = await locals.safeGetSession();
    // if (!user) {
    //   return fail(401, { search: { error: 'Unauthorized' } });
    // }

    // try {
    //   const search_results = await searchSimilarContent(
    //     user, 
    //     parseResult.data.searchQuery, 
    //     5, 
    //     parseResult.data.selectedTags
    //   );
    //   return { search_results, search: { success: true } };
    // } catch (err) {
    //   console.error('Search error:', err);
    //   return fail(500, { search: { error: 'An error occurred while searching the content.' } });
    // }
  }
};