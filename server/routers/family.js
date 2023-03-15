const express = require("express");
// controller de l'utilisateur
const { familyController } = require("../controller");
// middleware authentification
const { auth } = require("../service");

const router = express.Router();

/**
 * Une Family 
 * @typedef {object} Family
 * @property {string} name - Nom de la catégorie
 */


/**
 * GET /family
 * @summary Récupère toutes les familles de catégories
 * @security bearerAuth
 * @tags Family
 * @return {object} 200 - Retourne toutes les familles de catégories
 * @return {object} 500 - Erreur lors de l'envoi des familles de catégories
 */
//GET /family - route pour avoir toutes les familles des catégories
router.get("/families", auth.checkToken, familyController.getAllFamilies);


/**
 * GET /family/{id}
 * @summary Récupère une famille par ID
 * @security bearerAuth
 * @tags Family
 * @param {integer} id.path.required - ID de la famille à récupérer
 * @return {object} 200 - Retourne la famille correspondante à l'ID donné
 * @return {object} 500 - Erreur lors de l'envoi de la famille
 */
//GET /family/:id route - Pour avoir une famille
router.get("/family/:id", auth.checkToken, familyController.getFamilyById);


/**
 * POST /family
 * @summary Crée une famille
 * @security bearerAuth
 * @tags Family
 * @param {object} request.body.required - Les informations de la famille à créer
 * @param {string} request.body.name.required - Nom de la famille à créer
 * @return {object} 200 - Retourne un message de succès indiquant que la famille a été créée
 * @return {object} 500 - Erreur lors de la création de la famille
 */
//POST /family/:id route - Pour créer une famille
router.post("/family", auth.checkToken, auth.isAdmin, familyController.createFamily);


/**
 * PATCH /family/{id}
 * @summary Modifier une famille d'huiles
 * @security bearerAuth
 * @tags Family
 * @param {object} request.body.required - Les informations de la famille à modifier
 * @param {string} request.body.name.required - Nouveau nom de la famille
 * @pathParam {integer} id - L'identifiant de la famille à modifier
 * @return {object} 200 - Retourne un message de succès indiquant que la famille a été modifiée
 * @return {object} 500 - Requête invalide, tous les champs doivent être remplis
 * @return {object} 500 - Erreur lors de la modification de la famille
 */
//PATCH /family/:id - route pour modifier une famille des huiles
router.patch("/family/:id", auth.checkToken, auth.isAdmin, familyController.updateFamily);


/**
 * DELETE /family/{id}
 * @summary Supprime une famille
 * @security bearerAuth
 * @tags Family
 * @param {string} id.path.required - ID de la famille à supprimer
 * @return {object} 201 - Retourne un message de succès indiquant que la famille a été supprimée
 * @return {object} 500 - Erreur lors de la suppression de la famille
 */
//DELETE /family/:id - route pour modifier une famille des huiles
router.delete("/family/:id", auth.checkToken, auth.isAdmin, familyController.deleteFamily);


module.exports = router;