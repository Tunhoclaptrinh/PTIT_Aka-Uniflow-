# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY packages/ ./packages/
COPY apps/backend/ ./apps/backend/

RUN npm install --workspace=apps/backend
RUN npm run build --workspace=apps/backend

# Production runtime
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/packages/ ./packages/
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/package*.json ./

RUN npm install --omit=dev --workspace=apps/backend
EXPOSE 3000
CMD ["node", "dist/main"]
