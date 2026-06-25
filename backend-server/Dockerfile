FROM node:20-alpine
RUN mkdir /my_app
COPY app.js /my_app
COPY seed.js /my_app
COPY package.json /my_app
WORKDIR /my_app
RUN apk --no-cache add --virtual builds-deps build-base python3
RUN npm install --omit=dev
EXPOSE 3000
CMD ["sh", "-c", "node seed.js && node app.js"]
