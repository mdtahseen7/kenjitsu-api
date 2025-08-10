# Stage 1: Build & Prune Dependencies
FROM node:22-bullseye AS builder

# Enable pnpm 
RUN corepack enable

WORKDIR /app

# Copy package  files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies
RUN pnpm install

# Copy what ever remains
COPY . .

# Build 
RUN pnpm run build

# Remove dev dependencies 
RUN pnpm prune --prod


# Stage 2: Production Image
FROM node:22-alpine AS production

WORKDIR /app

# Copy production dependencies
COPY --from=builder /app/node_modules ./node_modules

# Copy built application code
COPY --from=builder /app/dist ./dist

# Copy public folder if it exists
COPY --from=builder /app/public ./public

# Copy package.json for metadata/scripts
COPY package.json ./

# Expose port
EXPOSE 3000

# Start the API
CMD ["node", "dist/server.js"]
