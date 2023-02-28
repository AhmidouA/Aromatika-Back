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






module.exports = router; 