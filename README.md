# api-pruebatecnica
Prueba tecnica para dinamycore
🧰 Requisitos previos
| Herramienta                                        | Versión recomendada | Verificar instalación    |
| -------------------------------------------------- | ------------------- | ------------------------ |
| [Node.js](https://nodejs.org/)                     | ≥ 18.x              | `node -v`                |
| [npm](https://www.npmjs.com/)                      | ≥ 9.x               | `npm -v`                 |
| [Docker](https://www.docker.com/)                  | ≥ 24.x              | `docker -v`              |
| [Docker Compose](https://docs.docker.com/compose/) | ≥ 2.x               | `docker compose version` |

📦 Clonar el proyecto
git clone [https://github.com/tu-usuario/payments-api.git](https://github.com/JAbdiarai/api-pruebatecnica)
cd payments-api

🐳 Despliegue con Docker
  1️⃣ Construir y levantar los contenedores
      docker compose up -d --build
  2️⃣ Verificar que estén corriendo
      docker ps
🗃️ Inicializar la base de datos (Prisma)
Si es la primera vez que levantas el proyecto:

docker compose exec api npx prisma migrate deploy
docker compose exec api npx prisma generate


Opcional: para sembrar datos iniciales (si tienes prisma/seed.ts):

docker compose exec api npx prisma db seed



generar cert and keys
npm run cert:gen
