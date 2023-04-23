FROM node:16-alpine As production
WORKDIR /opt/app
ADD package.json package.json
RUN npm install --only=prod
COPY ./_dist .

CMD ["node", "./bin/start.js"]
