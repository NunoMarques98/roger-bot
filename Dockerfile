FROM node:latest

LABEL maintainer="Nuno Carriço"
LABEL description="This example installs node"

WORKDIR /usr/src/bot

COPY package*.json settings.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]



