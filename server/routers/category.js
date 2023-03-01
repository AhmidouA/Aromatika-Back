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
 * PATCH /category - route pour modifier une categorie des huiles
 *
 */
router.patch("/category/:id", categoryController.updateCategory);

/**
 * DELETE /categories - route pour supprimer une categories des huiles
 * 
 */
router.delete("/category/:id", categoryController.deleteCategory);

module.exports = router;
