FROM node:16-alpine


WORKDIR /usr/src

COPY [".", "usr/src/"]

RUN npm install

EXPOSE 3000

RUN npm run build

CMD ["node", "run","start"]