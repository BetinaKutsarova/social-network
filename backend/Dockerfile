FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "dev"]
