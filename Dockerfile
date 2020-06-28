FROM node

RUN mkdir -p /js
WORKDIR /js
COPY . .

RUN yarn install

ENTRYPOINT yarn start
