#!/bin/bash

#On error no such file entrypoint.sh, execute in terminal - dos2unix .docker\entrypoint.sh

### FRONT-END
cd /var/www/frontend
if [ ! -f ".env" ]; then cp .env.example .env; fi 
npm install 

### BACK-END
cd /var/www/backend
if [ ! -f ".env" ]; then cp .env.example .env; fi
if [ ! -f ".env.testing" ]; then cp .env.testing.example .env.testing; fi
chown -R www-data:www-data .
composer install
php artisan key:generate
php artisan migrate
php-fpm