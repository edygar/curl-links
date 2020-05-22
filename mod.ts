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

  const request = await fetch(url);
  const html = await request.text();
  const $: CheerioStatic = cheerio.load(html);

  Array.from($("a"), $).forEach(($a: Cheerio) => {
    found.add($a.prop("href"))
  })
}
console.log(
  Array.from(found.values()).join("\n"),
);
