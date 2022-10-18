FROM node:latest
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install
ENV PORT=4000
EXPOSE 4000
CMD node server.js