const express = require("express");
// controller de l'utilisateur
const { categoryController } = require("../controller");
// middleware authentification
const { auth } = require("../service");

const router = express.Router();

/**
 * Une Category 
 * @typedef {object} Category
 * @property {string} name - Nom de la catégorie
 */

/**
 * GET /categories/{family}
 * @summary Récupère toutes les Category par famille
 * @security bearerAuth
 * @tags Category
 * @param {string} family.path.required - Famille de la catégorie
 * @return {object} 200 - Retourne un tableau contenant toutes les catégories pour la famille donnée
 * @return {object} 500 - Erreur inattendue
 */
//GET /categories - route pour avoir toutes les categories des huiles par famille
router.get("/categories/:family", auth.checkToken, categoryController.getAllCategories);



/**
 * POST /categories/{family}
 * @summary Ajoute une Category
 * @security bearerAuth
 * @tags Category
 * @param {string} family.path.required - Famille de la catégorie
 * @param {Category} request.body.required - Catégorie à ajouter
 * @return {object} 200 - Retourne la catégorie créée
 * @return {object} 500 - Erreur serveur lors de la création de la catégorie
 * @return {object} 500 - Erreur inattendue
 */
//POST /categories - route pour ajouter une categories des huiles
router.post("/categories/:family", auth.checkToken, auth.isAdmin, categoryController.addCategory);


/**
 * GET /category/{id}
 * @summary Récupère une Category par son ID
 * @security bearerAuth
 * @tags Category
 * @param {string} id.path - ID de la catégorie à récupérer
 * @return {object} 200 - Retourne la catégorie correspondante à l'ID donné
 * @return {object} 500 - Erreur serveur
 */
// GET /category route - Pour avoir une categorie des huiles
router.get("/category/:id", auth.checkToken, categoryController.getOneCategories);


/**
 * PATCH /category/{id}
 * @summary Modifie une Category
 * @security bearerAuth
 * @tags Category
 * @param {string} id.path.required - ID de la catégorie à modifier
 * @param {Category} request.body.required - Catégorie modifiée
 * @return {object} 200 - Retourne la catégorie modifiée
 * @return {object} 500 - La catégorie correspondante à l'ID donné est introuvable
 * @return {object} 500 - La catégorie existe déja
 */
//PATCH /category - route pour modifier une categorie des huiles
router.patch("/category/:id", auth.checkToken, auth.isAdmin, categoryController.updateCategory);


/**
 * DELETE /category/{id}
 * @summary Supprime une Category
 * @security bearerAuth
 * @tags Category
 * @param {string} id.path.required - ID de la catégorie à supprimer
 * @return {object} 204 - La catégorie a été supprimée avec succès
 * @return {object} 500 - Erreur inattendue
 */
//DELETE /categories - route pour supprimer une categories des huiles
//Pour la méthode DELETE il est important d'inclure 
// l'ID car nous voulons supprimer une ressource existante dans la base de données qui a un ID.
router.delete("/category/:id", auth.checkToken, auth.isAdmin, categoryController.deleteCategory);

module.exports = router;
