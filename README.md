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

     1. Verifica que tengas instalados:  
    `node -v`
    `npm -v`
    `docker -v`
    `docker compose version`  
    2. crear archivo .env en raiz de proyecto(api-pruebatecnicav1)
    3. copiar lo que contiene example.env en .env y guardar

    Debes ver versiones activas (Node ≥ 18, Docker ≥ 24).  
🚀 2. Levantar los servicios desde la raíz del proyecto:
    `docker compose up -d --build`  
🔍 3. Verifica que estén corriendo:  
    `docker ps`  
    Deberías ver algo como:  

    CONTAINER ID   IMAGE                 STATUS          PORTS
    a1b2c3d4e5f6   payments-api          Up 1 minute     0.0.0.0:3000->3000/tcp
    b2c3d4e5f6g7   postgres:16-alpine    Up 1 minute     0.0.0.0:5432->5432/tcp

🧠 4. Inicializar la base de datos (Prisma)  
    Ejecuta estos comandos dentro del contenedor de la API:  
    `docker compose exec api npx prisma migrate deploy`  
    `docker compose exec api npx prisma generate`  


🔐 Medidas de seguridad implementadas

    1️⃣ Autenticación con JWT (JSON Web Tokens)

        Cada usuario debe autenticarse para acceder a los endpoints protegidos.

        Se generan dos tipos de tokens:

        Access Token (expira en minutos, para solicitudes activas).

        Refresh Token (expira en días, para renovar sesiones).

        Los tokens se firman con claves secretas almacenadas en variables de entorno (JWT_ACCESS_SECRET, JWT_REFRESH_SECRET).

    2️⃣ Cifrado de contraseñas con Bcrypt

        Las contraseñas de los usuarios nunca se guardan en texto plano.

        Se utiliza bcrypt con un número adecuado de “salt rounds” (por defecto 12).

        Esto impide recuperar contraseñas aun si la base de datos es comprometida.

    3️⃣ Encriptación de datos sensibles (AES-256-GCM)

        Información crítica (como el número de tarjeta) se cifra antes de guardarse en la base de datos.

        Se utiliza el algoritmo AES-256-GCM, considerado estándar de seguridad militar.

        Cada registro usa un vector de inicialización (IV) único para evitar ataques por patrones repetidos.

        Las claves se guardan en variables de entorno (CRYPTO_KEY_HEX).

    4️⃣ Protecciones HTTP con Helmet y CORS

        Helmet añade cabeceras HTTP seguras para prevenir ataques comunes (XSS, clickjacking, sniffing).

        CORS se configura para restringir orígenes autorizados, evitando que sitios externos realicen peticiones no permitidas.

    5️⃣ Rate Limiting

        Se implementa un limitador de peticiones por IP para prevenir ataques de denegación de servicio (DoS).

        Limita la cantidad de solicitudes que un cliente puede hacer en un periodo corto.

    6️⃣ Manejo seguro de variables y secretos

        Los secretos, claves y credenciales se almacenan únicamente en el archivo .env (no versionado en Git).

        Docker y el sistema de despliegue cargan las variables en tiempo de ejecución.

    7️⃣ Control de roles y permisos

        Se implementa middleware requireAuth y requireAdmin para restringir el acceso a endpoints según el rol del usuario (e.g. ADMIN, USER).

        Los usuarios estándar no pueden acceder a información de otros.

    8️⃣ Aislamiento con Docker

        La base de datos PostgreSQL corre en un contenedor separado del backend.

        La comunicación se realiza internamente en la red de Docker, evitando exposición pública del puerto 5432.

        Solo el servicio api accede al contenedor db.

    9️⃣ Registro y monitoreo

        Se usa morgan para registrar solicitudes HTTP y posibles errores.

        Estos logs pueden integrarse con sistemas de monitoreo (Datadog, ELK, etc.) para auditorías de seguridad.
