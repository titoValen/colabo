# Colabo

Colabo es una aplicación web con API en Laravel y cliente React/Vite.

## Requisitos

- PHP 8.2 o superior
- Composer
- Node.js
- pnpm
- Una base de datos TiDB

## 1. Clonar el repositorio

```bash
git clone https://github.com/titoValen/colabo.git
cd colabo
```

## 2. Configurar TiDB

La API usa MySQL, por lo que puede conectarse a TiDB.

```bash
cd api
copy .env.example .env
composer install
php artisan key:generate
```

En `api/.env`, descomentá y completá estos datos con los que muestra tu cluster de TiDB:

```dotenv
DB_CONNECTION=mysql
DB_HOST=<host-de-tidb>
DB_PORT=4000
DB_DATABASE=<nombre-de-la-base>
DB_USERNAME=<usuario>
DB_PASSWORD=<contraseña>
MYSQL_ATTR_SSL_CA=./storage/certs/isrgrootx1.pem
```

El certificado incluido en `api/storage/certs/isrgrootx1.pem` permite una conexión TLS con TiDB.

Ejecutá las migraciones:

```bash
php artisan migrate
```

## 3. Configurar las notificaciones VAPID

Las notificaciones push requieren las claves VAPID. Generalas desde el backend:

```bash
php artisan webpush:vapid
```

El comando agrega `VAPID_PUBLIC_KEY` y `VAPID_PRIVATE_KEY` a `api/.env`. Luego configurá el sujeto con una dirección válida:

```dotenv
VAPID_SUBJECT=mailto:soporte@colabo.app
```

En el directorio `client`, copiá el archivo de ejemplo y asigná a `VITE_VAPID_PUBLIC_KEY` exactamente la clave pública de `VAPID_PUBLIC_KEY`:

```bash
cd ../client
copy .env.example .env
```

```dotenv
VITE_VAPID_PUBLIC_KEY=<misma-clave-publica-vapid>
VITE_API_URL=http://localhost:8000/api
```

No compartas ni subas `VAPID_PRIVATE_KEY`.

## 4. Instalar y ejecutar

### Instalar el cliente

Desde la raíz del repositorio:

```bash
cd client
pnpm install
```

### Iniciar el backend

En una terminal nueva, desde la raíz del repositorio, instalá las dependencias del backend e iniciá la API:

```bash
cd api
composer install
php artisan serve
```

El backend quedará disponible en `http://localhost:8000`.

### Iniciar el frontend

En otra terminal, desde la raíz del repositorio:

```bash
cd client
pnpm dev
```

Abrí la dirección que indique Vite, normalmente `http://localhost:5173`.

Las notificaciones push funcionan en `localhost` o en un entorno servido mediante HTTPS.
