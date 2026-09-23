FROM node:22-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the Honeypot HTTP port
EXPOSE 8080

# Run the honeypot server
CMD ["npm", "start"]
