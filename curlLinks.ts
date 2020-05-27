// @deno-types="./typings/cheerio.d.ts"
import cheerio from "https://dev.jspm.io/npm:cheerio@0.22.0/index.js";

/**
 * Curl the given target URLs and return all links
 */
export async function curlLinks(targets: Array<string>, { logErrors = true } = {}): Promise<Array<string>> {
  const lookups = new Set(targets)
  const found: Set<string> = new Set()

  for await (let url of lookups) {
    try {
      url = new URL(url).toString();
    } catch (e) {
      $: for (let scheme of ['https://', 'http://']) {
        if (!url.startsWith(scheme)) {
          const newUrl = `${scheme}${url}`
          if (!lookups.has(newUrl)) {
            lookups.add(newUrl)
          } else {
            continue $;
          }
        }
      }
      continue;
    }

    try {
      const request = await fetch(url);
      const html = await request.text();
      const $: CheerioStatic = cheerio.load(html);

      Array.from($("a"), (a: CheerioElement) => a.attribs.href).forEach((href) => {
        try {
          if (href)
            found.add(new URL(href, url).toString())
        } catch(e) {
          if (logErrors)
            console.error('Invalid url:', href)
        }
      })
    } catch (e) {
      if (logErrors) {
        console.error("Error while trying to fetch", url)
        console.error(e)
      }
    }
  }

  return Array.from(found.values());
}
