FROM node:16-alpine


WORKDIR /usr/src

COPY . /usr/src/

COPY package*.json ./

RUN npm install

EXPOSE 3000

RUN npm run build

CMD ["npm", "run","start"]