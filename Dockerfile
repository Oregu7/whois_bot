FROM node:16-alpine As development

WORKDIR /opt/app
ADD package.json package.json
RUN npm install
COPY . .
RUN npm run build

FROM node:16-alpine As production
WORKDIR /opt/app
ADD package.json package.json
RUN npm install --only=prod
COPY --from=development /opt/app/_dist .

CMD ["node", "./bin/start.js"]
