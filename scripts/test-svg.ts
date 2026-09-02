import { fetchGitHubStats } from "../src/lib/github";
import { renderTemplate } from "../src/lib/templates";

async function main() {
  const stats = await fetchGitHubStats("0xdevabir");
  const svg = renderTemplate("pro-dashboard", "dark", stats);
  console.log("length:", svg.length);
  if (!svg.startsWith("<svg")) {
    console.error("Invalid SVG start");
    process.exit(1);
  }
  console.log("OK");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
