import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

// Keep a content-hashed stylesheet so cached pages retain their matching styles.
const css = await readFile(new URL("../css/style.css", import.meta.url));
const hash = createHash("sha256").update(css).digest("hex").slice(0, 12);
const stylesheet = `css/style.${hash}.css`;
await writeFile(new URL(`../${stylesheet}`, import.meta.url), css);
for (const [source, output] of [["site", "index"], ["ai-boost", "ai-boost"]]) {
  const template = await readFile(new URL(`../src/${source}.html`, import.meta.url), "utf8");
  const page = template.replaceAll("{{asset:css/style.css}}", stylesheet);
  if (/\{\{[^}]+\}\}/.test(page)) throw new Error(`Unresolved template key in ${source}`);
  await writeFile(new URL(`../${output}.html`, import.meta.url), page);
  console.log(`Built ${output}.html`);
}
// Older Croatian links still open the English site; there is no language selector.
await writeFile(new URL("../hr.html", import.meta.url), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="refresh" content="0;url=./"><link rel="canonical" href="https://www.motiq.hr/"><meta name="robots" content="noindex,follow"><title>Motiq Labs</title></head><body><p><a href="./">Continue to Motiq Labs</a></p></body></html>\n`);
console.log("Built legacy hr.html redirect");
