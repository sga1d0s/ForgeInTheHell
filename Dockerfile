FROM nginx:mainline-alpine3.22

# Config mínima: usa tu default.conf
# COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Copia del sitio estático
COPY . /usr/share/nginx/html

EXPOSE 8080