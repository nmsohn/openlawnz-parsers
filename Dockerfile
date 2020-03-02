FROM node:latest
MAINTAINER openlawnz

RUN apt-get update

WORKDIR /app
COPY . /app

RUN yarn install
COPY . /app

EXPOSE 80