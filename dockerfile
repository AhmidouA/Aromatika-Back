# image de base
FROM node:16-alpine3.16

# définition du répertoire de travail
WORKDIR /app

# copie des fichiers de l'application dans l'image
# le premier . c'est parce que nous somme déja dans le dossier source: maestro@MBP-de-Maestro Grandma's Cooking % 
COPY . .

# Copie le fichier package.json et package-lock.json dans le conteneur
COPY package*.json ./

# installation des dépendances
RUN npm install

# Définit la variable d'environnement NODE_ENV à "production"
ENV NODE_ENV=production

# Copie le fichier .env dans le conteneur
COPY .env .

# exposition du port
EXPOSE $PORT

# commande de démarrage de l'application
CMD [ "node", "index.js" ]