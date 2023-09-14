FROM node:16-alpine as builder

WORKDIR /usr/src
COPY package*.json ./
RUN npm install --only=production
COPY . /usr/src/
RUN npm install --only=development
RUN npm run test:e2e
RUN npm run build

FROM node:16-alpine 

WORKDIR /usr/src
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder ["/usr/src/dist","/usr/src/dist/"]
COPY --from=builder ["/usr/src/.env","/usr/src/.env"]
EXPOSE 3000
CMD ["npm", "run","start"]