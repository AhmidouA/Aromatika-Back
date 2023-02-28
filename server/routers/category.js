const express = require("express");
// controller de l'utilisateur
const { categoryController } = require("../controller");
// middleware authentification
const { auth } = require("../service");

const router = express.Router();

/**
 * GET /categories - route pour avoir toutes les categories des huiles par famille
 */
router.get("/categories/:family", categoryController.getAllCategories);

/**
 * POST /categories - route pour ajouter une categories des huiles
 *
 */
router.post("/categories/:family", categoryController.addCategory);

/**
 * GET /category route - Pour avoir une categorie des huiles
 *
 */
router.get("/category/:id", categoryController.getOneCategories);

/**
 * patch /category - route pour modifier une categorie des huiles
 *
 */
router.patch("/category/:id", categoryController.updateCategory);

/**
 * POST /categories - route pour ajouter une categories des huiles
 * DELETE /categories - route pour supprimer une categories des huiles
 */

// router.patch("/category", categoryController);
// router.delete("/category", categoryController);

module.exports = router;
