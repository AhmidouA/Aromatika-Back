const express = require("express");
// controller de l'utilisateur
const { categoryController } = require("../controller");
// middleware authentification
const { auth } = require("../service");

const router = express.Router();

/**
 * Une catégorie 
 * @typedef {object} Catégorie
 * @property {string} name - Nom de la catégorie
 */

/**
 * GET /api/categories/{family}
 * @summary Récupère toutes les catégories par famille
 * @tags Catégories
 * @param {string} family.path.required - Famille de la catégorie
 * @return {object} 200 - Retourne un tableau contenant toutes les catégories pour la famille donnée
 * @return {object} 500 - Erreur inattendue
 */
//GET /categories - route pour avoir toutes les categories des huiles par famille
router.get("/categories/:family", auth.checkToken, categoryController.getAllCategories);



/**
 * POST /api/categories/{family}
 * @summary Ajoute une catégorie
 * @tags Catégories
 * @param {string} family.path.required - Famille de la catégorie
 * @param {Catégorie} request.body.required - Catégorie à ajouter
 * @return {object} 200 - Retourne la catégorie créée
 * @return {object} 500 - Erreur serveur lors de la création de la catégorie
 * @return {object} 500 - Erreur inattendue
 */
//POST /categories - route pour ajouter une categories des huiles
router.post("/categories/:family", auth.checkToken, auth.isAdmin, categoryController.addCategory);


/**
 * GET /api/category/{id}
 * @summary Récupère une catégorie par son ID
 * @tags Catégories
 * @param {string} id.path - ID de la catégorie à récupérer
 * @return {object} 200 - Retourne la catégorie correspondante à l'ID donné
 * @return {object} 500 - Erreur lors de l'envoi d'une catégorie
 * @return {object} 500 - Erreur inattendue
 */
// GET /category route - Pour avoir une categorie des huiles
router.get("/category/:id", auth.checkToken, categoryController.getOneCategories);


/**
 * PATCH /api/category/{id}
 * @summary Modifie une catégorie
 * @tags Catégories
 * @param {string} id.path.required - ID de la catégorie à modifier
 * @param {Catégorie} request.body.required - Catégorie modifiée
 * @return {object} 200 - Retourne la catégorie modifiée
 * @return {object} 500 - La catégorie correspondante à l'ID donné est introuvable
 * @return {object} 500 - Erreur inattendue
 */
//PATCH /category - route pour modifier une categorie des huiles
router.patch("/category/:id", auth.checkToken, auth.isAdmin, categoryController.updateCategory);


/**
 * DELETE /api/category/{id}
 * @summary Supprime une catégorie
 * @tags Catégories
 * @param {string} id.path.required - ID de la catégorie à supprimer
 * @return {object} 204 - La catégorie a été supprimée avec succès
 * @return {object} 500 - Erreur lors de la modification de la catégorie
 * @return {object} 500 - Erreur inattendue
 */
//DELETE /categories - route pour supprimer une categories des huiles
//Pour la méthode DELETE il est important d'inclure 
// l'ID car nous voulons supprimer une ressource existante dans la base de données qui a un ID.
router.delete("/category/:id", auth.checkToken, auth.isAdmin, categoryController.deleteCategory);

module.exports = router;
