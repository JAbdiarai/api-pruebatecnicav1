FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Generar certificados SSL automáticamente
RUN node scripts/generate-cert.js

# No generar Prisma aquí, se hará en runtime con las variables de entorno
EXPOSE 3000
CMD ["npm", "run", "dev"]
