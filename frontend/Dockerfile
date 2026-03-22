FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY frontend/src ./src
COPY frontend/index.html .
COPY frontend/vite.config.js .

# Expose port
EXPOSE 5173

# Run the development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
