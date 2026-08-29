# ---- Dependencies ----
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
COPY dashboard/package.json ./dashboard/
# Workspace needs these even if not used by dashboard
COPY ai-analysis-engine/package.json ./ai-analysis-engine/
COPY backend/package.json ./backend/
COPY mcp-servers/azure-cost-mcp/package.json ./mcp-servers/azure-cost-mcp/

RUN npm ci --ignore-scripts

# ---- Build ----
FROM deps AS build
WORKDIR /app

COPY dashboard/ ./dashboard/

# Build-time env for Next.js public vars
ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build --workspace=dashboard

# ---- Production ----
FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

# Copy standalone output
COPY --from=build /app/dashboard/.next/standalone ./
COPY --from=build /app/dashboard/.next/static ./dashboard/.next/static
COPY --from=build /app/dashboard/public ./dashboard/public 2>/dev/null || true

# Non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup
USER appuser

EXPOSE 3000

ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

CMD ["node", "dashboard/server.js"]
