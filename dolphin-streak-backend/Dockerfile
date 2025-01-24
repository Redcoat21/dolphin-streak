FROM node:20

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --quiet
RUN npm install --legacy-peer-deps
RUN npm install --force

# Copy all files including .env
COPY . .

# Build the application
RUN npm run build

EXPOSE 8102

CMD ["npm", "run", "start:prod"]