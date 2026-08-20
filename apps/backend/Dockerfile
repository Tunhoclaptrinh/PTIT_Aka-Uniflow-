# syntax=docker/dockerfile:1
# ==============================================================================
# UniFlow AI — Backend API Gateway (NestJS)
# Build context BẮT BUỘC là repo root
# ==============================================================================

# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/udm-schema/package.json ./packages/udm-schema/
COPY apps/backend/package.json ./apps/backend/

# Cần devDependencies để có tsc + nest CLI
RUN npm install --include=dev

COPY packages/ ./packages/
COPY apps/backend/ ./apps/backend/

# Build shared packages trước (shared-types -> udm-schema), rồi backend
RUN npm run build:packages \
 && npm run build --workspace=apps/backend

# ── Stage 2: Production runtime ───────────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache curl

# Manifests + packages đã build (dist đi kèm)
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/packages/ ./packages/
COPY --from=builder /app/apps/backend/package.json ./apps/backend/
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

RUN npm install --omit=dev --workspaces --include-workspace-root \
 && npm cache clean --force

USER node

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
    CMD curl -fsS http://localhost:3000/api/v1/metrics >/dev/null || exit 1

CMD ["node", "apps/backend/dist/main"]
