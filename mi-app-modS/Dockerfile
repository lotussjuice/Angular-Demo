ARG BUILD_CONFIG=production
FROM node:latest AS node
WORKDIR /app
COPY ./ ./
RUN npm install
RUN npm run build -- --configuration ${BUILD_CONFIG}

FROM nginx:alpine
COPY --from=node /app/dist/mi-app-modS/browser /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
