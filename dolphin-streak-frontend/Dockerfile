FROM node:20

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy all files including .env
COPY . .

# Build the application
RUN npm run build
    
EXPOSE 3000

CMD ["npm", "run", "start", "--", "-H", "0.0.0.0"]