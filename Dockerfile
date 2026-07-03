FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production
COPY . .
WORKDIR /app/backend
EXPOSE 3000
CMD ["sh", "-c", "node backend/seed.js && node backend/server.js"]

