FROM node:20-alpine AS build

WORKDIR /app

# Copy server package files
COPY server/package.json server/package-lock.json ./server/

# Install dependencies
WORKDIR /app/server
RUN npm ci

# Copy source files needed for build
WORKDIR /app
COPY server/tsconfig.json ./server/
COPY server/src/ ./server/src/
COPY web/src/models/ ./web/src/models/

# Make server deps resolvable from shared model files
RUN ln -s /app/server/node_modules /app/node_modules

# Build
WORKDIR /app/server
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/server/package.json /app/server/package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/server/dist/ ./dist/

EXPOSE 3000

CMD ["node", "dist/server/src/index.js"]
