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
COPY --from=devModules /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run build
ENV NODE_ENV=staging
RUN npm install --only=production

# Stage 3
FROM node:18-alpine as production
# WORKDIR /usr/src/app
COPY --from=stagingBuild /usr/src/app/node_modules ./node_modules
COPY --from=stagingBuild /usr/src/app/dist ./dist

# CMD npm run start:staging
CMD [ "node", "dist/main.js" ]