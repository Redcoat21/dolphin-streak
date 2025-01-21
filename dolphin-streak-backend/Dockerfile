FROM node:20

WORKDIR /usr/src/app

# Copy package files first for better layer caching
COPY package*.json ./

# Install both dependencies and devDependencies
RUN npm i

# Install both dependencies and devDependencies
RUN npm install --legacy-peer-deps

# Copy application source
COPY . .

# Build the application
RUN npm run build

EXPOSE 3000

# Production run command (remove devDependencies for final image)
CMD ["npm", "run", "start:prod"]