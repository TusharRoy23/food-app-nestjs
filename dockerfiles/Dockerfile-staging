# stage 1
FROM node:18-alpine as devModules
WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm install --only=development
COPY . .

# Stage 2
FROM node:18-alpine as stagingBuild
WORKDIR /usr/src/app
COPY ./package*.json ./
COPY env/.staging.env ./.env
COPY --from=devModules /usr/src/app ./
COPY . .
RUN npm run build
ENV NODE_ENV=staging
RUN npm install --only=production

# Stage 3
FROM node:18-alpine as production
WORKDIR /usr/src/app
COPY --from=stagingBuild /usr/src/app/ ./

CMD npm run start:staging