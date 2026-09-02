# syntax=docker/dockerfile:1
# MyState — GitHub stats cards. Stateless Next.js standalone server, no DB.

ARG NODE_VERSION=20-bookworm-slim

# ---------------------------------------------------------------------------
# 1. deps
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---------------------------------------------------------------------------
# 2. builder
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---------------------------------------------------------------------------
# 3. runner
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs nextjs

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD curl -fsS "http://127.0.0.1:${PORT}/" || exit 1

CMD ["node", "server.js"]
