FROM node:latest
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN yarn

RUN yarn build
EXPOSE 8081

CMD [ "node", "dist/index.js" ]
USER node
