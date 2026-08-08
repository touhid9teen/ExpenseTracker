# syntax=docker/dockerfile:1

# ── 1. Dependencies ──
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci

# ── 2. Build ──
FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ARG DATABASE_URL
ARG JWT_SECRET
ARG GEMINI_API_KEY
ENV DATABASE_URL=$DATABASE_URL JWT_SECRET=$JWT_SECRET GEMINI_API_KEY=$GEMINI_API_KEY
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ── 3. Production runner (Next.js standalone output) ──
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
