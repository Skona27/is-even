FROM node:14.17-alpine3.13

WORKDIR /usr/src/app

COPY ./package.json ./

RUN npm install

COPY . .
