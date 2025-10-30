FROM nginx:1.27-alpine

# Config mínima: usa tu default.conf
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Copia del sitio estático
COPY . /usr/share/nginx/html

EXPOSE 80