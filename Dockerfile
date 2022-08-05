FROM node:16

WORKDIR /my/

COPY ./package.json /my/
COPY ./yarn.lock /my/

RUN yarn install
COPY . /my
CMD yarn start:dev