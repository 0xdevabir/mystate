import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { getDemoStats } from "../src/lib/demo-stats.ts";
import { TEMPLATE_LIST, renderTemplate } from "../src/lib/templates/index.ts";
import { DEFAULT_THEME } from "../src/lib/themes/index.ts";

const outDir = resolve("scripts/template-previews");
mkdirSync(outDir, { recursive: true });

const stats = getDemoStats("0xdevabir");
let ok = 0;

for (const meta of TEMPLATE_LIST) {
  try {
    const svg = renderTemplate(meta.id, DEFAULT_THEME, stats);
    if (!svg.includes("<svg")) throw new Error("invalid svg");
    writeFileSync(resolve(outDir, `${meta.id}.svg`), svg);
    ok++;
  } catch (error) {
    console.error(`FAIL ${meta.id}:`, error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

console.log(`Rendered ${ok}/${TEMPLATE_LIST.length} templates -> ${outDir}`);
