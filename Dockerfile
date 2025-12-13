FROM node:20-alpine

WORKDIR /usr/src/app

EXPOSE 3000

ENV PORT 3000

COPY package.json yarn.lock ./

RUN yarn install

CMD [ "yarn", "start:dev" ]