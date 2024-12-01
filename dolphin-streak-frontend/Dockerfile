# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json before installing dependencies
COPY package.json ./

# Install dependencies
RUN npm install --legacy-peer-deps && echo "Dependencies installed successfully"

# Copy the rest of the application
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the application in development mode (watch for file changes)
CMD ["npm", "run", "next-dev"]
