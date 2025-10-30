# --- Runtime (Nginx) ---
FROM nginx:1.27.2
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080