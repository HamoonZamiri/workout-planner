FROM node:latest
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm install
RUN npm install -g typescript

RUN npm run build
EXPOSE 8081

CMD [ "node", "build/index.js" ]
USER node