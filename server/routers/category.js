const express = require("express");
// controller de l'utilisateur
const { categoryController } = require("../controller");
// middleware authentification
const { auth } = require("../service");

const router = express.Router();

/**
 * GET /categories - route pour avoir toutes les categories des huiles par famille
 */
router.get("/categories/:family", auth.checkToken, categoryController.getAllCategories);

/**
 * POST /categories - route pour ajouter une categories des huiles
 *
 */
router.post("/categories/:family", auth.checkToken, auth.isAdmin, categoryController.addCategory);

/**
 * GET /category route - Pour avoir une categorie des huiles
 *
 */
router.get("/category/:id", auth.checkToken, categoryController.getOneCategories);

/**
 * PATCH /category - route pour modifier une categorie des huiles
 *
 */
router.patch("/category/:id", auth.checkToken, auth.isAdmin, categoryController.updateCategory);

/**
 * DELETE /categories - route pour supprimer une categories des huiles
 * 
 */
router.delete("/category/:id", auth.checkToken, auth.isAdmin, categoryController.deleteCategory);

module.exports = router;
