import { curlLinks } from "./curlLinks.ts";

const links = await curlLinks(Deno.args.slice(0))
console.log(links.join("\n"));
