import * as cheerio from "cheerio";
import * as fs from "fs/promises";
import path from "path";
import TurndownService from "turndown";
import { URL } from "url";
import getHtml from "waterfall-fetch";

const turndownService = new TurndownService();

async function crawlWebsite(baseUrl: string, maxDepth: number = -1): Promise<void> {
	const visitedUrls = new Set<string>();
	const urlsToVisit: { url: string; depth: number }[] = [{ url: baseUrl, depth: 0 }];
	const domain = new URL(baseUrl).hostname;

	while (urlsToVisit.length > 0) {
		const current = urlsToVisit.pop();
		if (!current || visitedUrls.has(current.url)) continue;

		const { url: currentUrl, depth: currentDepth } = current;

		try {
			console.log(`Crawling: ${currentUrl} (Depth: ${currentDepth})`);
			const page_response = await getHtml(currentUrl);
			if (!page_response || !page_response.html || page_response.status !== 200) {
				console.error(`Failed to load page: ${currentUrl}`);
				continue;
			}
			const $ = cheerio.load(page_response.html);

			// Convert HTML to Markdown and save the content
			const markdown = turndownService.turndown($.html());
			await saveContent(currentUrl, markdown);

			// Add new URLs to visit if we haven't reached the max depth
			if (maxDepth === -1 || currentDepth < maxDepth) {
				$("a").each((_, element) => {
					const href = $(element).attr("href");
					if (href) {
						const fullUrl = new URL(href, currentUrl).href;
						if (fullUrl.includes(domain) && !visitedUrls.has(fullUrl)) {
							urlsToVisit.push({ url: fullUrl, depth: currentDepth + 1 });
						}
					}
				});
			}

			visitedUrls.add(currentUrl);
		} catch (error) {
			console.error(`Error crawling ${currentUrl}:`, error);
		}
	}

	console.log("Crawling completed");
}

async function saveContent(url: string, content: string): Promise<void> {
	const urlObj = new URL(url);
	const filePath = path.join("crawled_data", urlObj.hostname, urlObj.pathname);
	await fs.mkdir(path.dirname(filePath), { recursive: true });
	await fs.writeFile(`${filePath}.md`, content);
}

// Usage
crawlWebsite("https://youtube.com", 2); // Crawl up to depth 2
