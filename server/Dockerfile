FROM node:18.20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . ./

CMD [ "npm", "run", "start"]