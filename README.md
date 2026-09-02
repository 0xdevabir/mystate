# MyState

Beautiful GitHub stats cards for your profile README. Pick a template, copy one line, done.

**Live:** [mystate.devabir.me](https://mystate.devabir.me)

## How it works

1. Enter your GitHub username
2. Browse 9 beautifully designed templates with live previews
3. Copy the one-line embed code into your README

```markdown
![MyState](https://mystate.devabir.me/api/stats?username=YOUR_USERNAME&theme=classic)
```

## Templates

| Theme | Style |
|-------|-------|
| `classic` | GitHub-inspired dark card |
| `aurora` | Northern lights gradient |
| `minimal` | Elegant serif on white |
| `glass` | Frosted glass morphism |
| `terminal` | Hacker terminal aesthetic |
| `neon` | Cyberpunk neon borders |
| `ocean` | Deep blue waves |
| `sunset` | Warm orange & purple |
| `midnight` | Deep purple with accent |

## Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_BASE_URL` | Yes (prod) | Base URL for embed links |
| `GITHUB_TOKEN` | No | GitHub PAT for higher API rate limits |

## Deployment

Deploy to Vercel, Railway, or any Node.js host. Set `NEXT_PUBLIC_BASE_URL` to your domain.

Point `mystate.devabir.me` to your deployment via DNS CNAME.

## Tech stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- Framer Motion
- GitHub REST API
