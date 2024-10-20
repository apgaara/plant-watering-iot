FROM node:alpine
WORKDIR /usr/src/app
COPY packages*.json ./
RUN npm install
COPY ../api .
EXPOSE 3000

#run server
CMD [ "node", "index.js" ]
