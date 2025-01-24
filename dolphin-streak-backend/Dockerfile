FROM node:20

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies including dev dependencies
RUN npm cache clean --force 
RUN npm install --quiet
RUN npm install --legacy-peer-deps
RUN npm install --force
RUN npm install @google-cloud/speech @google-cloud/storage @google/generative-ai @nestjs-modules/mailer @nestjs/axios @nestjs/common @nestjs/config @nestjs/core @nestjs/jwt @nestjs/mongoose @nestjs/passport @nestjs/platform-express @nestjs/schedule @nestjs/serve-static @nestjs/swagger @ruraim/nestjs-midtrans argon2 axios class-transformer class-validator cloudinary express-handlebars form-data hbs luxon mongoose multer node-cron node-wav passport passport-google-oauth2 passport-http-bearer passport-jwt passport-local reflect-metadata rxjs ua-parser-js uuid @nestjs/cli @nestjs/schematics @nestjs/testing @swc/cli @swc/core @types/express @types/jest @types/luxon @types/multer @types/node @types/passport-google-oauth2 @types/passport-http-bearer @types/passport-jwt @types/passport-local @types/supertest @types/ua-parser-js @typescript-eslint/eslint-plugin @typescript-eslint/parser @vitest/coverage-v8 eslint eslint-config-prettier eslint-plugin-prettier jest prettier source-map-support supertest ts-jest ts-loader ts-node tsconfig-paths typescript unplugin-swc vitest
RUN npm install @css-inline/css-inline-linux-x64-gnu
RUN npm install --omit=dev
# Copy all files including .env
COPY . .

# Build the application
RUN npm run build

EXPOSE 8102

CMD ["npm", "run", "start:prod"]