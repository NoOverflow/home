FROM node:24-slim AS builder
WORKDIR /usr/src/app

COPY . .
RUN npm ci
RUN npx quartz build

FROM nginxinc/nginx-unprivileged:1.29-trixie-perl

COPY --from=builder /usr/src/app/public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080