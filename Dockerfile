FROM node:16

WORKDIR /app

COPY . ./
RUN npm install
RUN npm run build
RUN chmod -R o+r /app/public/

EXPOSE 8080
ENV HOST=0.0.0.0

CMD [ "npm", "start" ]
USER node
