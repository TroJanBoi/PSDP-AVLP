FROM node:22-bookwarm-slim

RUN pwd
COPY ./Frontend/avlp /app
WORKDIR /app

RUN rm -rf "app(examples)"
RUN npm ci
RUN npm i sharp
RUN npm run build

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]