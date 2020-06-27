FROM node

COPY . .

RUN yarn install

ENTRYPOINT yarn start
