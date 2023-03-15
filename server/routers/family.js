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
router.get("/families", auth.checkToken, familyController.getAllFamilies);


//GET /family/:id route - Pour avoir une famille
router.get("/family/:id", auth.checkToken, familyController.getFamilyById);

//POST /family/:id route - Pour créer une famille
router.post("/family", auth.checkToken, auth.isAdmin, familyController.createFamily);

//PATCH /family/:id - route pour modifier une famille des huiles
router.patch("/family/:id", auth.checkToken, auth.isAdmin, familyController.updateFamily);




module.exports = router;