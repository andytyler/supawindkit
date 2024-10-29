import supabase from '$lib/supabase';
import type { RequestHandler } from "@sveltejs/kit";
import * as sitemap from "super-sitemap";
import { WebsiteBaseUrl } from "../../../config";

export const prerender = true

export const GET: RequestHandler = async () => {
  // Fetch all blog post slugs
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug');

    return await sitemap.response({
    origin: WebsiteBaseUrl,
    excludeRoutePatterns: [
      ".*\\(admin\\).*", // i.e. exclude routes within admin group
    ],
    paramValues: {
      '/blog/[slug]': posts?.map(post => post.slug) || []
    }
  });

}
