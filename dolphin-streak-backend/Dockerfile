FROM node:20

WORKDIR /usr/src/app

# Copy package files first
COPY package*.json ./

# Install ALL dependencies including devDependencies
RUN npm install --frozen-lockfile --include=dev

# Copy source files
COPY . .

# Build the application
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]