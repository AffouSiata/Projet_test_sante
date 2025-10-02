#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy

echo "Seeding database..."
npx prisma db seed || echo "Seed already ran or failed"

echo "Starting application..."
exec node dist/src/main
