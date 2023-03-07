const express = require("express");
// controller de l'utilisateur
const { oilController } = require("../controller");
// middleware authentification
const { auth } = require("../service");
const router = express.Router();


/**
 * Une Oil 
 * @typedef {object} Oil
 * @property {string} name - Nom de le huile
 * @property {string} botanic_name - Nom botanique de le huile
 * @property {string} description - Description de le huile
 * @property {string} extraction - La methode d'extraction de le huile
 * @property {string} molecule - La molecule de le huile
 * @property {string} plant_family - La famille de plante de le huile
 * @property {string} scent - Le parfum de le huile
 * @property {string} image - L'image de le huile
 */

/**
 * GET /essential/{id}
 * @summary Récupère une Oil essentielle par son ID
 * @security bearerAuth
 * @tags essential Oil
 * @param {integer} id.path.required - ID de l'huile essentielle à récupérer
 * @return {object} 200 - Retourne l'huile essentielle correspondante à l'ID donné
 * @return {object} 500 - Erreur lors de l'envoi d'une huile essentielle
 */
//GET /essential route - Pour avoir une huiles
router.get("/essential/:id", auth.checkToken, oilController.getOilById);


/**
 * POST /essential
 * @summary Ajoute une nouvelle huile essentielle
 * @security bearerAuth
 * @security adminAuth
 * @tags essential Oil
 * @param {Huile} request.body.required - Les informations de l'huile essentielle à ajouter
 * @return {object} 200 - Retourne l'huile essentielle ajoutée
 * @return {object} 500 - Erreur lors de l'ajout de l'huile essentielle
 */
// POST /essential - route pour ajouter une huiles
router.post("/essential", auth.checkToken, auth.isAdmin, oilController.createOil);


/**
 * PATCH /essential/{id}
 * @summary Met à jour d'une essential Oil par son ID
 * @security bearerAuth
 * @tags essential Oil
 * @param {integer} id.path.required - ID de l'huile essentielle à mettre à jour
 * @param {Huile} request.body.required - Les informations à mettre à jour pour l'huile essentielle
 * @return {object} 200 - Retourne l'huile essentielle mise à jour
 * @return {object} 500 - Erreur lors de la mise à jour de l'huile essentielle
 */
//PATCH /essential - route pour modifier une huiles
router.patch("/essential/:id", auth.checkToken, auth.isAdmin, oilController.updateOilById);


/**
 * DELETE /essential/{id}
 * @summary Supprime une essential Oil par son ID
 * @security bearerAuth
 * @tags essential Oil
 * @param {integer} id.path.required - ID de l'huile essentielle à supprimer
 * @return {object} 200 - Retourne un message de succès
 * @return {object} 500 - Erreur lors de la suppression d'une huile essentielle
 */
// DELETE /essential - route supprimer une huile Pour la méthode DELETE il est important d'inclure 
//l'ID car nous voulons supprimer une ressource existante dans la base de données qui a un ID.
router.delete("/essential/:id", auth.checkToken, auth.isAdmin, oilController.deleteOilById);

module.exports = router;
