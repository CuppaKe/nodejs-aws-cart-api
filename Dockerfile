# Stage 1: Build the app
FROM node:20-alpine AS builder

WORKDIR /app

# Install only production dependencies first to speed up Docker caching
COPY package*.json ./
RUN npm ci

# Copy all source files (except those excluded by .dockerignore)
COPY . .

# Build the NestJS app (it will not compile tests if tsconfig excludes them)
RUN npm run build

# Stage 2: Create the production image
FROM node:20-alpine AS production

WORKDIR /app

# Copy only required files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

COPY .env .env

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

CMD ["node", "dist/main"]