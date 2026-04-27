# Utilise l'image légère de Nginx
FROM nginx:alpine

# Copie le contenu du dépôt dans le dossier que Nginx utilise pour servir le web
COPY . /usr/share/nginx/html

# Expose le port 80
EXPOSE 80
