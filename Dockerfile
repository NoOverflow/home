FROM node:24-slim AS builder
USER 1000
WORKDIR /usr/src/app
COPY package.json .
COPY package-lock.json* .
RUN npm ci

WORKDIR /usr/src/app
USER 1000
COPY . .

USER 0
ENV npm_config_cache=/cache
RUN mkdir /cache && \
    chgrp -R 0 /usr/src/app /cache && \
    chmod -R g=u /usr/src/app /cache && \
    chmod -R 777 /cache

USER 1000
ENV npm_config_cache=/cache
RUN npx quartz --help > /dev/null 2>&1 || true

USER 0
RUN chmod -R 777 /cache

USER 1000
CMD ["npx", "quartz", "build", "--serve"]
