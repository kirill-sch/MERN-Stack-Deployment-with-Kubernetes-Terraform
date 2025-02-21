FROM node:18.20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

RUN apk add --no-cache bash

ENV MONGODB_STRING=mongodb://admin:mongo@mongo:27017/

COPY . ./

CMD [ "npm", "run", "dev"]