FROM node:18-alpine

WORKDIR /app

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

COPY package*.json ./
RUN npm install

COPY . .

RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi

EXPOSE 3000

CMD if [ "$NODE_ENV" = "production" ]; then \
        npm start; \
    else \
        npm run dev; \
    fi