# Use Node 20 (required by sqlite3@6.0.1)
FROM node:20-alpine

# Install build tools needed to compile sqlite3 native bindings
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Railway injects PORT automatically
EXPOSE 3000

CMD ["node", "server.js"]
