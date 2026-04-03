# Frontend
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Если Vite, команда "npm run dev".  Вот это у нас
# Если Create React App — "npm start".
CMD ["npm", "run", "dev"]