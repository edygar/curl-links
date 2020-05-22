/// @deno-types="./typings/cheerio.d.ts"
import cheerio from "https://dev.jspm.io/npm:cheerio@0.22.0/index.js"

for await (const url of Deno.args) {
  try {
    new URL(url)
  } catch(e) { continue; }
  const request = await fetch(url)

  const html = await request.text()
  const $: CheerioStatic = cheerio.load(html)

  console.log(Array.from($('a'), $).map(($a: Cheerio) => $a.prop('href')).join('\n'))
}
