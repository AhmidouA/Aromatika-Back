const express = require("express");
// controller de l'utilisateur
const { categoryController } = require("../controller");
// middleware authentification
const { auth } = require("../service");

const router = express.Router();

/**
 * GET /categories Poour avoir toutes les categories des huiles par famille
 */
router.get("/categories/:family", categoryController.getAllCategories);

/**
 * POST /categories - route pour ajouter une categories des huiles
 *
 */
router.post("/categories/:family", categoryController.addCategory);

/**
 * GET /categories Poour avoir une categorie des huiles
 *
 */
router.get("/category/:id", categoryController.getOneCategories);

/**
 * POST /categories - route pour ajouter une categories des huiles
 * PATCH /categories - route pour modifier une categories des huiles
 * DELETE /categories - route pour supprimer une categories des huiles
 */

// router.patch("/category", categoryController);
// router.delete("/category", categoryController);

module.exports = router;
