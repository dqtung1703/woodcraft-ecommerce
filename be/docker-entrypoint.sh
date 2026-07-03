#!/usr/bin/env sh
set -e

php artisan config:clear
php artisan route:clear
php artisan view:clear

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  php artisan migrate --force

  # Seed dữ liệu mẫu nếu bảng users còn trống
  USER_COUNT=$(php artisan tinker --execute="echo \App\Models\User::count();" 2>/dev/null | tail -1)
  if [ "${USER_COUNT}" = "0" ] || [ -z "${USER_COUNT}" ]; then
    php artisan db:seed --force
  fi
fi

php artisan storage:link 2>/dev/null || true

php artisan config:cache
php artisan route:cache
php artisan view:cache

exec php artisan serve --host=0.0.0.0 --port="${PORT:-10000}"
