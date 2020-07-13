FROM node:12.18.1

LABEL maintainer="Simon Carr"

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . /app/

EXPOSE 3333

CMD [ "npm", "start"]
