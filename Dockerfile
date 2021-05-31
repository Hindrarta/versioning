FROM node:14.17.0-alpine3.13

WORKDIR /app

RUN npm install -g pm2 sequelize-cli

COPY package.json .

RUN npm install

COPY . /app

RUN cp env.example .env

CMD pm2-runtime app.js