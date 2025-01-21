FROM node:23-alpine

WORKDIR /app

RUN apk update && \
    apk add git && \
    npm install -g @vue/cli nuxt create-nuxt-app
