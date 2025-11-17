FROM node:14

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY . .

RUN npm install -g peer

RUN npm run build --no-cache

EXPOSE 3000
EXPOSE 9000


