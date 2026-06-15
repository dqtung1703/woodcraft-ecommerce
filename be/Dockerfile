FROM php:8.4-cli-alpine

WORKDIR /var/www/html

RUN apk add --no-cache \
    bash \
    curl-dev \
    icu-dev \
    libzip-dev \
    oniguruma-dev \
    unzip \
    zip \
  && docker-php-ext-install \
    bcmath \
    curl \
    intl \
    mbstring \
    pdo_mysql \
    zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock ./

ENV COMPOSER_ALLOW_SUPERUSER=1

RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader \
    --no-scripts

COPY . .

RUN composer dump-autoload --optimize \
  && chmod +x docker-entrypoint.sh \
  && mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
  && chmod -R 775 storage bootstrap/cache

EXPOSE 10000

ENTRYPOINT ["./docker-entrypoint.sh"]
