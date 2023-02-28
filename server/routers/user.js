const express = require("express");
// controller de l'utilisateur
const { userController } = require("../controller");
// middleware authentification
const { auth } = require("../service");

const router = express.Router();

/**
 * GET / - route pour la home Page (Page d'acceuil)
 */
router.get("/", userController.homePage);

/**
 * GET /signup - route pour récupere la page formulaire d'inscription
 * POST /signup - route pour completer le formulaire d'inscription
 */
router.get("/signup", userController.indexSignupPage);
router.post("/signup", userController.signup);

/**
 * GET /login - route pour récupere la page formulaire de connexion
 * POST /login - route pour completer le formulaire de connexion
 */
router.get("/login", userController.indexLoginPage);
router.post("/login", userController.login);

/**
 * GET /logout - route pour la décoonnexion
 */
router.get("/logout", auth.checkToken, userController.logout);

/**
 * GET /profile - route pour le profil de l'utilisateur avec un middleware token
 */
router.get("/profile", auth.checkToken, userController.profile);

module.exports = router;
