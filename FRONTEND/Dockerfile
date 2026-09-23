FROM node:22-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the frontend (optional, but we'll run the dev server for this deployment so hot-reloading works if mapped)
# RUN npm run build

# Expose the Vite dev server port
EXPOSE 5173

# Run Vite with --host to expose it outside the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
