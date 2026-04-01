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

# Copy server source files
COPY server/tsconfig.json ./server/
COPY server/src/ ./server/src/

# Build
WORKDIR /app/server
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy root workspace files
COPY package.json package-lock.json ./

# Copy shared package (needed at runtime)
COPY shared/ ./shared/

# Copy server package.json
COPY server/package.json ./server/

# Install production dependencies only
RUN npm ci --workspace=server --workspace=shared --include-workspace-root --omit=dev

# Copy built output
COPY --from=build /app/server/dist/ ./server/dist/

EXPOSE 8080

CMD ["node", "server/dist/src/index.js"]
