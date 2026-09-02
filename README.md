# MyState

Beautiful GitHub stats cards for your profile README.

**Live:** [mystate.devabir.me](https://mystate.devabir.me)

## How it works

1. Enter your GitHub username
2. Pick a **layout** (8 unique arrangements)
3. Pick a **color theme** (dark, light, dark green, etc.)
4. Copy one line into your README

```markdown
![MyState](https://mystate.devabir.me/api/stats?username=YOUR_USERNAME&template=profile-card&theme=dark-green)
```

## Layouts

| Template | Description |
|----------|-------------|
| `profile-card` | Avatar sidebar + full stats grid |
| `dashboard` | 3-column activity / repos / social panels |
| `terminal` | CLI output with all metrics |
| `stats-grid` | Dense 7-column metric grid |
| `banner` | Wide horizontal strip |
| `radial-hub` | Circular orbiting stats |
| `activity-stack` | Vertical grouped sections |
| `compact-strip` | Ultra-wide single-row header |

## Color themes

`dark` · `light` · `dark-green` · `ocean` · `sunset` · `purple` · `nord` · `dracula` · `wheat`

## Stats included

Stars, forks, repos, followers, following, gists, commits, PRs, issues, reviews, total contributions, watchers, avg stars/repo, account age, top languages.

> **Note:** Commits, PRs, issues, and reviews require `GITHUB_TOKEN` (GraphQL API).

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_BASE_URL` | Yes (prod) | Base URL for embed links |
| `GITHUB_TOKEN` | Recommended | Server-side PAT for full contribution stats |

```bash
# .env.local (server only — never expose to client)
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
NEXT_PUBLIC_BASE_URL=https://mystate.devabir.me
```

## Development

```bash
npm install
npm run dev
```

## Tech stack

Next.js 16 · TypeScript · Tailwind CSS 4 · GitHub REST + GraphQL API
