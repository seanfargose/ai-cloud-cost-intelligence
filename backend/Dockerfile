# ---- Dependencies ----
FROM node:20-alpine AS deps
WORKDIR /app

# Copy workspace root package files
COPY package.json package-lock.json ./
COPY ai-analysis-engine/package.json ./ai-analysis-engine/
COPY backend/package.json ./backend/
COPY mcp-servers/azure-cost-mcp/package.json ./mcp-servers/azure-cost-mcp/
COPY dashboard/package.json ./dashboard/

RUN npm ci --ignore-scripts

# ---- Build AI Engine ----
FROM deps AS build-ai
WORKDIR /app
COPY ai-analysis-engine/ ./ai-analysis-engine/
RUN npm run build --workspace=ai-analysis-engine

# ---- Build MCP Server ----
FROM build-ai AS build-mcp
COPY mcp-servers/ ./mcp-servers/
RUN npm run build --workspace=mcp-servers/azure-cost-mcp || true

# ---- Build Backend ----
FROM build-mcp AS build-backend
COPY backend/ ./backend/
RUN npm run build --workspace=backend

# ---- Production ----
FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

# Copy workspace root
COPY package.json package-lock.json ./
COPY ai-analysis-engine/package.json ./ai-analysis-engine/
COPY backend/package.json ./backend/
COPY mcp-servers/azure-cost-mcp/package.json ./mcp-servers/azure-cost-mcp/
COPY dashboard/package.json ./dashboard/

RUN npm ci --omit=dev --ignore-scripts

# Copy built artifacts
COPY --from=build-backend /app/ai-analysis-engine/dist/ ./ai-analysis-engine/dist/
COPY --from=build-backend /app/backend/dist/ ./backend/dist/
COPY --from=build-backend /app/mcp-servers/ ./mcp-servers/

# Non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup
USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8000/health || exit 1

CMD ["node", "backend/dist/index.js"]
