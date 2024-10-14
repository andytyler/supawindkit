import { crawlWebsite } from "$lib/server/extrapolate/extrapolate-limited-md.ts";
import type { Actions } from './$types';


export const actions: Actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const input_url = data.get('input_url');
        const depth = data.get('depth');

        // Here you would implement the actual crawling logic
        await crawlWebsite(input_url as string, parseInt(depth as string))
        // For now, we'll just return a success message
        console.log(`Crawling ${input_url} with depth ${depth}`);

        return {
            success: true,
            message: `Started crawling ${input_url} with depth ${depth}`
        };
    }
};

