FROM node:20-alpine

WORKDIR /learming_managament_system

COPY package*.json ./
COPY prisma ./prisma 

RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]
