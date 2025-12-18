# 1. Choose Node runtime
FROM node:20-alpine

# 2. Set working directory inside container
WORKDIR /app

# 3. Copy package files first (better caching)
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the backend code
COPY . .

# 6. Expose backend port
EXPOSE 3000

# 7. Start the server
CMD ["node", "server.js"]