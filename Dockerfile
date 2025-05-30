FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm ci

# Copy the rest of the files
COPY . .

# Set a placeholder for build-time environment variables
ENV MONGODB_URI="mongodb://placeholder-db/placeholder"
ENV JWT_SECRET="placeholder-secret"
ENV NODE_ENV="production"

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Copy necessary files from build stage
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# At runtime, these will be overridden by Docker Compose or runtime environment
ENV MONGODB_URI=""
ENV JWT_SECRET=""

EXPOSE 3000

CMD ["npm", "start"]