# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY packages/ ./packages/
COPY apps/backend/ ./apps/backend/

# Cài devDependencies để có tsc và nest CLI
RUN npm install --include=dev

# Build shared packages trước (shared-types rồi udm-schema)
RUN npm run build:packages

# Build backend NestJS
RUN npm run build --workspace=apps/backend

# Production runtime
FROM node:20-alpine
WORKDIR /app

# Copy workspace root manifests + packages đã build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/packages/ ./packages/
COPY --from=builder /app/apps/backend/package*.json ./apps/backend/

# Copy dist của backend
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

# Cài production deps với đúng workspace structure
RUN npm install --omit=dev

EXPOSE 3000
CMD ["node", "apps/backend/dist/main"]
