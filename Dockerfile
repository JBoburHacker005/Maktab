# Use Bun as base image
FROM oven/bun:1.3.5 AS base

WORKDIR /app

# Copy package files first for better caching
COPY package.json ./

# Install dependencies (without frozen lockfile to allow updates)
RUN bun install

# Copy all source files
COPY . .

# Build the application (this will run copy-teacher-images automatically)
RUN bun run build

# Expose port
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Start the server using bun's native TypeScript support
CMD ["bun", "run", "server.ts"]

