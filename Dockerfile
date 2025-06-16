# Use Node 22 LTS with pnpm
FROM node:22-slim AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Production stage
FROM node:22-slim AS production

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy built application from build stage
COPY --from=base /app/.output ./.output
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Copy database files for migrations
COPY --from=base /app/drizzle ./drizzle
COPY --from=base /app/db ./db
COPY --from=base /app/drizzle.config.ts ./drizzle.config.ts

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Install drizzle-kit for migrations
RUN pnpm add drizzle-kit

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", ".output/server/index.mjs"]
