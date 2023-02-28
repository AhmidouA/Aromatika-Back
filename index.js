const express = require("express");
const app = express();
// module dotenv
require("dotenv").config();

// Les routers
const { oilRouter, userRouter, categoryRouter } = require("./server/routers");

// les cors pour l'appel a l'Api
const cors = require("cors");
// middleware par default pour permettre d'appeler l'api (Tout le monde par default)
app.use(cors());

const error = require("./server/service/auth");
// formatage de données envoyées à un serveur
app.use(express.urlencoded({ extended: true }));
// le contenu du body sera du json
app.use(express.json());

// Le port du serveur
const PORT = process.env.PORT ?? 3000;

// utilisation des views pour le client (TEST)
app.set("view engine", "ejs");
app.set("views", "./server/views");

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
app.use(userRouter, oilRouter, categoryRouter);

// middleware 404
app.use(error.notFound);

// l'écoute du serveur
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
