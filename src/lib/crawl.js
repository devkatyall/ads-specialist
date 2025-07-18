// utils/crawl.js
import * as cheerio from "cheerio";

export async function crawlPage(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; Bot/1.0)" },
    next: { revalidate: 60 }, // cache for 60s
  });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const html = await res.text();

  const $ = cheerio.load(html);

  // Extract metadata
  const title = $("title").first().text().trim();
  const metaDescription =
    $('meta[name="description"]').attr("content")?.trim() || "";

  // Remove unwanted boilerplate elements
  const tagsToRemove = [
    "script",
    "style",
    "noscript",
    "iframe",
    "svg",
    "nav",
    "footer",
    "header",
    "button",
    "input",
    "form",
  ];
  tagsToRemove.forEach((tag) => $(tag).remove());

  // Collect text from all remaining elements
  let texts = [];
  $("body *")
    .contents()
    .each((_, el) => {
      if (el.type === "text") {
        const t = $(el).text().replace(/\s+/g, " ").trim();
        if (t.length > 30 && !texts.includes(t)) {
          texts.push(t);
        }
      }
    });

  // Merge & limit length
  const mainText = texts.join(" ").slice(0, 8000); // safety limit
  const wordCount = mainText.split(/\s+/).length;

  return {
    title,
    metaDescription,
    mainText,
    wordCount,
    sourceUrl: url,
  };
}
