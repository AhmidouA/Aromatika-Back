#Aromatikä
Aromatikä est une application pour gérer les huiles essentielles. Cette application utilise PostgreSQL pour stocker les données. Elle est construite avec Node.js, Express, pg et d'autre dépendances 

## Installation
1- Cloner le dépôt git
```bash
git clone https://github.com/ton-nicolas-92/aromatika.git
```

2- Installer les dépendances
```bash
cd aromatika
npm install
```

3- Créer un fichier .env pour les variables d'environnement
```bash
cp .env.example .env
```

4- Modifier les valeurs des variables d'environnement dans le fichier .env avec les valeurs appropriées
```bash
PORT=
PGUSER=
PGDATABASE=
PGPASSWORD=
PGHOST=
REFRESH_SECRET=
EMAIL_USERNAME=
EMAIL_PASSWORD= 
SECRET=
```

5- Créer une base de données PostgreSQL pour l'application.

6- Lancer l'application
```bash
npm start
// ou 
node index.js
```

## Utilisation
Une fois l'application lancée, ouvrez votre navigateur web et accédez à http://localhost:3000 pour accéder à l'application.

## Fonctionnalités
L'application permet de:

Consulter la liste des huiles essentielles
Consulter la liste des catégories
Consulter la liste des familles
Ajouter/modifier/supprimer des huiles essentielles
Ajouter/modifier/supprimer des catégories
Ajouter/modifier/supprimer des familles

## Contribuer
Forker le dépôt
Créer une nouvelle branche (git checkout -b feature/feature-name)
Faire les modifications nécessaires
Faire un commit (git commit -am 'Add some feature')
Pousser les modifications (git push origin feature/feature-name)
Créer une Pull Request
Licence

###
