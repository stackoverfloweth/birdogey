FROM node:20-alpine AS build

WORKDIR /app

# Copy root workspace files
COPY package.json package-lock.json ./

# Copy shared package
COPY shared/ ./shared/

# Copy server package
COPY server/package.json ./server/

# Install dependencies using workspaces
RUN npm ci --workspace=server --workspace=shared --include-workspace-root

# Build shared
WORKDIR /app/shared
RUN npm run build

# Copy server source files
WORKDIR /app
COPY server/tsconfig.json ./server/
COPY server/src/ ./server/src/

# Build server
WORKDIR /app/server
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy root workspace files
COPY package.json package-lock.json ./

# Copy shared package.json (for workspace linking) and compiled bundle
COPY shared/package.json ./shared/
COPY --from=build /app/shared/dist/ ./shared/dist/

# Copy server package.json and env schema (varlock reads .env.schema at runtime)
COPY server/package.json ./server/
COPY server/.env.schema ./server/

# Install production dependencies only
RUN npm ci --workspace=server --workspace=shared --include-workspace-root --omit=dev

# Copy built server output
COPY --from=build /app/server/dist/ ./server/dist/

EXPOSE 8080

WORKDIR /app/server
CMD ["node", "dist/src/index.js"]
