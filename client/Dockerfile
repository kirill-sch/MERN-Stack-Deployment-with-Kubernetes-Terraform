
##BUILD ENVIRONMENT##

FROM node:18.20-alpine As build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

#RUN apk update && apk add bash

COPY . .

RUN npm run build

##PRODUCTION ENVIRONMENT##

FROM nginx:alpine As production

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]