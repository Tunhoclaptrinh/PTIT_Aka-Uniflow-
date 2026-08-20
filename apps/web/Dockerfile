# syntax=docker/dockerfile:1
# ==============================================================================
# UniFlow AI — Frontend Web Dashboard (React + Vite + Ant Design)
# Build context BẮT BUỘC là repo root (cần package-lock.json + packages/)
# ==============================================================================

# ── Stage 1: Build SPA ────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Manifests trước để tận dụng layer cache khi source thay đổi
COPY package.json package-lock.json ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/udm-schema/package.json ./packages/udm-schema/
COPY apps/web/package.json ./apps/web/

# Cài full workspace (cần devDeps: vite, tsc, less)
RUN npm install --include=dev

COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

# Vite inline biến môi trường lúc BUILD, không phải lúc runtime.
# Mặc định dùng đường dẫn tương đối để nginx trong container này proxy sang backend.
ARG VITE_API_URL=/api/v1
ARG VITE_APP_TITLE="UniFlow AI - Nền tảng iPaaS TMĐT 0-Chạm"
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_TITLE=$VITE_APP_TITLE

RUN npm run build --workspace=apps/web

# ── Stage 2: Nginx runtime ────────────────────────────────────────────────────
FROM nginx:1.27-alpine
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
