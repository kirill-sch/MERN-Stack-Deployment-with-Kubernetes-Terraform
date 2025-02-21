FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm build

FROM nginx:latest

COPY --from=builder /app/dist /usr/share/nginx/html