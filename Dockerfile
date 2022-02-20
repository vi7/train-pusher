FROM node:16.13-alpine3.15

LABEL description="Lego Duplo trains pusher"
LABEL maintainer="github.com/vi7"

ARG appdir=/app

RUN mkdir $appdir
RUN apk add --no-cache bluez libudev-zero libudev-zero-dev
COPY ["src", ".eslintrc.json", "package*.json", "$appdir/"]
WORKDIR $appdir

RUN apk add --no-cache python3 make g++ \
  && npm install \
  && apk del --purge python3 make g++ \
  && rm -rf /tmp/*.apk /var/cache/apk/*

EXPOSE 8080

ENTRYPOINT ["node", "main"]
