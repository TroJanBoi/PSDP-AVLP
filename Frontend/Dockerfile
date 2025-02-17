# === Build Stage ===
FROM node:22-bullseye-slim AS builder

# RUN pwd
# COPY ./Frontend/avlp-app /app
WORKDIR /app

# Copy package files and install dependencies
# WORKDIR ./Frontend/avlp-app
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of your application code
COPY . .
# Build your Next.js application
RUN npm run build

# Production Stage
FROM node:22-bullseye-slim

WORKDIR /avlp-app

# Copy package files
# COPY package.json package-lock.json* ./
# RUN npm install 

# Copy build output and public folder from builder
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public

# Expose the port
EXPOSE 3000

# ENTRYPOINT [ "npm", "start" ]
# Start the application
CMD ["npm", "start"]