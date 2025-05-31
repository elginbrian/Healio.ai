FROM node:18-alpine

WORKDIR /app

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

COPY package*.json ./
RUN npm install

COPY . .

# Only build in production mode and ignore failures in development
RUN if [ "$NODE_ENV" = "production" ]; then npm run build || exit 1; fi

EXPOSE 3000

# Use JSON format for CMD to properly handle signals
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then npm start; else npm run dev; fi"]