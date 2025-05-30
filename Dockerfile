FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

ENV NODE_ENV="development"
ENV PORT=3000

CMD ["npm", "run", "dev"]