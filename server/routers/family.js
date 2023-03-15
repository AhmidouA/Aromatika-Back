const express = require("express");
// controller de l'utilisateur
const { familyController } = require("../controller");
// middleware authentification
const { auth } = require("../service");

const router = express.Router();

/**
 * Une Family 
 * @typedef {object} Category
 * @property {string} name - Nom de la catégorie
 */



//GET /family - route pour avoir toutes les familles des catégories
router.get("/family", auth.checkToken, familyController.getAllFamilies);






module.exports = router;