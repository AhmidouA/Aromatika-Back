const express = require("express");
// controller de l'utilisateur
const { userController } = require("../controller");

const router = express.Router();

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

module.exports = router;