FROM php:8.3-cli
RUN apt-get update && apt-get install -y git unzip libzip-dev libpng-dev libonig-dev libxml2-dev && docker-php-ext-install pdo_mysql mbstring
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
WORKDIR /var/www
COPY . .
RUN composer install --no-interaction --prefer-dist --optimize-autoloader
EXPOSE 8000
CMD ["sh","-c","php artisan migrate --seed --force && php artisan serve --host=0.0.0.0 --port=8000"]
