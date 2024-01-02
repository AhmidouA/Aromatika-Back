const express = require("express");
const app = express();
const session = require("cookie-session");
const path = require("path");
require("dotenv").config();
const {
  oilRouter,
  userRouter,
  categoryRouter,
  familyRouter,
} = require("./server/routers");
const error = require("./server/service/auth");

/****************************/
/**** Swagger generator  ****/
/****************************/
const expressJSDocSwagger = require("express-jsdoc-swagger");
const options = {
  info: {
    version: "1.0.0",
    title: "Aromatikä",
    description: "The Api endpoint of the essential oils",
    license: {
      name: "Oclock Project",
    },
  },
  security: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
    },
  },
  baseDir: __dirname,

  filesPattern: "./**/*.js",
};

expressJSDocSwagger(app)(options);

/********************************/
/**** Configuration express  ****/
/********************************/

const cors = require("cors");
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((err, req, res, next) => {
  logError(req, err);
  res.status(500).send("Quelque chose s'est mal passé");
});

app.use(express.static("public"));

const PORT = process.env.PORT ?? 3000;

app.use(
  session({
    saveUninitialized: true,
    resave: true,
    secret: process.env.SECRET,
  })
);

app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user;
  }
  next();
});

app.use(userRouter, oilRouter, categoryRouter, familyRouter);

app.use(error.notFound);

app.listen(PORT, () => {
  console.log(
    `Listening on aromatika-back-git-main-ahmidoua.vercel.app:${process.env.PORT}`
  );
});
