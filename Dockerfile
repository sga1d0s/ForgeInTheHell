# Runtime (Nginx) para servir sitio estático
FROM nginx:1.27-alpine

# Config Nginx
# COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# Copia del sitio (si construyes la imagen). En Portainer con bind mount no es necesario,
# pero así también puedes "docker build" y ejecutar sin volúmenes.
# COPY . /usr/share/nginx/html

EXPOSE 80