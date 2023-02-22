const express = require("express");
const { userController } = require("../controller");

const router = express.Router();

/**
 * GET /signup - route pour récupere la page formulaire d'inscription
 * POST /signup - route pour completer le formulaire d'inscription
 */
router.get("/signup", userController.index);
router.post("/signup", userController.signup);

module.exports = router;
