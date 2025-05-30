FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV MONGODB_URI="mongodb://placeholder-db/placeholder"
ENV JWT_SECRET="placeholder-secret"
ENV NODE_ENV="production"

RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV="production"

COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV MONGODB_URI=""
ENV JWT_SECRET=""

EXPOSE 3000

CMD ["npm", "start"]