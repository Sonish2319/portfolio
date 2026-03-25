# 1. Base image
FROM node:20-alpine AS builder

# 2. Set working directory
WORKDIR /app

# 3. Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# 4. Copy project
COPY . .

# 5. Build Next.js app
RUN npm run build

# 6. Production image
FROM node:20-alpine

WORKDIR /app

# Copy only necessary files
COPY --from=builder /app ./

# Expose port
EXPOSE 3000

# Set environment variables (optional, can also be set in docker-compose.yml)

# Start app
CMD ["npm", "start"]