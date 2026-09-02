# MyState

Beautiful GitHub stats cards for your profile README.

**Live:** [mystate.devabir.me](https://mystate.devabir.me)

## Premium templates

| Template | Focus |
|----------|-------|
| `pro-dashboard` | Full dashboard — graph, rank, languages, streaks |
| `contrib-graph` | Large contribution area chart |
| `language-expert` | Donut chart + detailed language breakdown |
| `streak-hero` | Streak cards + heatmap strip |
| `heatmap-pro` | GitHub-style contribution heatmap |
| `clean-slate` | Minimal elegant layout |

## Embed

```markdown
![MyState](https://mystate.devabir.me/api/stats?username=YOU&template=pro-dashboard&theme=dark)
```

## Stats included

Stars, forks, repos, followers, contributions (12mo + lifetime), commits, PRs, issues, reviews, streaks, rank grade, contributed-to count, top 8 languages with byte-accurate %, monthly contribution graph.

## Server env (required for full data)

```bash
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
NEXT_PUBLIC_BASE_URL=https://mystate.devabir.me
```

`GITHUB_TOKEN` is **server-only**. Without it, graphs, streaks, and contribution data will be empty.

**Token scopes:** `read:user`, `public_repo`

## Development

```bash
npm install
npm run dev
```
