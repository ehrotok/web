FROM node:23-alpine

WORKDIR /app

RUN apk add --update python3 make g++ git && \
    rm -rf /var/cache/apk/*
