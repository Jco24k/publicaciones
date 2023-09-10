FROM node:16-alpine


WORKDIR /usr/src

COPY package*.json ./

RUN npm install

COPY . /usr/src/

EXPOSE 3000

RUN npm run build

CMD ["npm", "run","start"]