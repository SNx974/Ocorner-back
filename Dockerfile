FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

# Dossier uploads persistant
RUN mkdir -p uploads

EXPOSE 4000

CMD ["node", "src/index.js"]
