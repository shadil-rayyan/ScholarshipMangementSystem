# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) first
# This allows us to leverage Docker's cache to avoid reinstalling dependencies if they haven't changed
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Next.js application
RUN npm run build

# Expose port 3000 to the outside world
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
