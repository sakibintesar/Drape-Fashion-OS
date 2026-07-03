FROM node:20-alpine

WORKDIR /app/backend

COPY backend/package*.json ./

RUN npm install

WORKDIR /app

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "node /app/backend/seed.js && node /app/backend/server.js"]
