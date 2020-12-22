FROM node:8.1.2-alpine

WORKDIR /
COPY . /
RUN npm install

CMD ["npm","start"]
