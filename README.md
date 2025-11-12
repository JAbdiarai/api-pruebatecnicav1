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

⚙️ 1. Configura tu entorno
    1️⃣ Verifica que tengas instalados:
    node -v
    npm -v
    docker -v
    docker compose version


    Debes ver versiones activas (Node ≥ 18, Docker ≥ 24).
🚀 2. Levantar los servicios
    Desde la raíz del proyecto:
    docker compose up -d --build
🔍 3. Verifica que estén corriendo:
    docker ps
    Deberías ver algo como:

    CONTAINER ID   IMAGE                 STATUS          PORTS
    a1b2c3d4e5f6   payments-api          Up 1 minute     0.0.0.0:3000->3000/tcp
    b2c3d4e5f6g7   postgres:16-alpine    Up 1 minute     0.0.0.0:5432->5432/tcp

🧠 4. Inicializar la base de datos (Prisma)
    Ejecuta estos comandos dentro del contenedor de la API:
    docker compose exec api npx prisma migrate deploy
    docker compose exec api npx prisma generate
