# 1. Use Node runtime
FROM node:20-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy dependency files first
COPY package*.json ./

# 4. Install frontend dependencies
RUN npm install

# 5. Copy the rest of the frontend code
COPY . .

# 6. Expose Vite dev server port
EXPOSE 5173

# 7. Start the Vite dev server
CMD ["npm", "run", "dev"]