#!/bin/sh
set -e

echo "🚀 Starting application..."

# Generar Prisma Client
echo "📦 Generating Prisma Client..."
npx prisma generate

# Ejecutar migraciones
echo "🔄 Running database migrations..."
npx prisma migrate deploy

# Ejecutar seed
echo "🌱 Seeding database..."
npm run prisma:seed || echo "⚠️  Seed already executed or failed (continuing...)"

# Iniciar la aplicación
echo "✅ Starting server..."
exec npm run dev
