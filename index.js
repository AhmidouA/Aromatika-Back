const express = require("express");
const app = express();
const path = require('path');
// module dotenv
require("dotenv").config();
// Les routers
const { oilRouter, userRouter, categoryRouter, familyRouter } = require("./server/routers");
// midlleware error
const error = require("./server/service/auth");


/****************************/
/**** Swagger generator  ****/
/****************************/
const expressJSDocSwagger = require('express-jsdoc-swagger');
const options = {
  info: {
      version: '1.0.0',
      title: 'Aromatikä',
      description : 'The Api endpoint of the essential oils',
      license: {
          name: 'Oclock Project',
      },
  },
  security: {
      bearerAuth: {
          type: 'http',
          scheme: 'bearer',
      },
  },
  baseDir: __dirname,
  // Glob pattern to find your jsdoc files (multiple patterns can be added in an array)
  filesPattern: './**/*.js',
};

expressJSDocSwagger(app)(options);


/********************************/
/**** Configuration express  ****/
/********************************/

// middleware favicon
const favicon = require('serve-favicon');
// Définir le chemin d'accès l'image favicon.ico
app.use(favicon(path.join("./server/public/upload/favicon.ico")));

// les cors pour l'appel a l'Api
const cors = require("cors");
// middleware par default pour permettre d'appeler l'api (Tout le monde par default)
app.use(cors());

// formatage de données envoyées à un serveur
app.use(express.urlencoded({ extended: true }));
// le contenu du body sera du json
app.use(express.json());

// Utilise le stream d'enregistrement de fichier pour toutes les requêtes entrantes et les réponses sortantes
app.use((err, req, res, next) => {
  logError(req, err);
  res.status(500).send('Quelque chose s\'est mal passé');
});

// Le port du serveur
const PORT = process.env.PORT ?? 3000;

// middleware Session
const session = require("express-session");
app.use(
  session({
    saveUninitialized: true,
    resave: true,
    secret: process.env.SECRET,
  })
);

// middelware de session permet l'accées a certaine fonctionnalité (feature)
app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user;
  }
  next();
});

// utilisation de nos routes
app.use(userRouter, oilRouter, categoryRouter, familyRouter);

// middleware 404
app.use(error.notFound);

// l'écoute du serveur
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
