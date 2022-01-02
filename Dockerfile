FROM node:16.13.1-alpine as base

WORKDIR /src
COPY package*.json /
EXPOSE 4000

FROM base as production
ENV NODE_ENV=production
RUN npm ci
COPY . /
CMD ["node", "src/index"]

FROM base as dev
ENV NODE_ENV=development
RUN npm install -g nodemon && npm install
COPY . /
CMD ["nodemon", "src/index"]