# Use an official Node.js runtime as a parent image
FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json first to leverage caching
COPY package*.json ./

# Use 'npm ci' for a clean, consistent production install
RUN npm ci --only=production

# Copy the rest of your application's code
COPY . .

EXPOSE 3500

# Run the app directly with Node for production
CMD [ "node", "server.js" ]