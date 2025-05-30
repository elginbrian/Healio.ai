FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port for Next.js dev server
EXPOSE 3000

# Set development environment
ENV NODE_ENV="development"
ENV PORT=3000

# Start development server
CMD ["npm", "run", "dev"]