FROM node:alpine

RUN mkdir /Server
WORKDIR /Server
RUN cd /Server
COPY package.json .
RUN  npm install
COPY . .

EXPOSE 3000
