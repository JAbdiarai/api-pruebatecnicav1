FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Generar certificados SSL automáticamente
RUN node scripts/generate-cert.js

# Dar permisos de ejecución al script de entrypoint
RUN chmod +x scripts/docker-entrypoint.sh

# No generar Prisma aquí, se hará en runtime con las variables de entorno
EXPOSE 3000

# Usar el script de entrypoint
ENTRYPOINT ["scripts/docker-entrypoint.sh"]
