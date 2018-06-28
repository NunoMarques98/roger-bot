FROM node:8

LABEL maintainer="Nuno Carriço"
LABEL description="This example installs node"

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 80/tcp
CMD [ "npm", "start" ]



