FROM node:18-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm install 

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_MIDTRANS_CLIENT_KEY_SANDBOX
ENV NEXT_PUBLIC_MIDTRANS_CLIENT_KEY_SANDBOX=${NEXT_PUBLIC_MIDTRANS_CLIENT_KEY_SANDBOX}

RUN npm run build && npm run build:cron

FROM base AS runner
ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json 
COPY --from=builder /app/dist_cron ./dist_cron       

EXPOSE 3000

CMD ["node", "server.js"] 