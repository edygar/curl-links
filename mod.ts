/// @deno-types="./typings/cheerio.d.ts"
import cheerio from "https://dev.jspm.io/npm:cheerio@0.22.0/index.js";

const target = new Set(Deno.args.slice(0));
const found = new Set()

for await (let url of target) {
  try {
    url = new URL(url).toString();
  } catch (e) {
    $: for (let scheme of ['https://', 'http://']) {
      if (!url.startsWith(scheme)) {
        const newUrl = `${scheme}${url}`
        if (!target.has(newUrl)) {
          target.add(newUrl)
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
      console.error('Invalid url:', href)
    }
  })
  } catch (e) {
    console.error("Error while trying to fetch", url)
    console.error(e)
  }
}

console.log(
  Array.from(found.values()).join("\n"),
);
