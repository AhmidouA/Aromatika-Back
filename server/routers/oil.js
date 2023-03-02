const express = require("express");
// controller de l'utilisateur
const { oilController } = require("../controller");
// middleware authentification
const { auth } = require("../service");

const router = express.Router();

/**
 * GET /essential route - Pour avoir une huiles
 *
 */
router.get("/essential/:id", oilController.getOilById);

/**
 * POST /essential - route pour ajouter une huiles
 *
 */
router.post("/essential", auth.checkToken, auth.isAdmin, oilController.createOil);

/**
 * PATCH /essential - route pour modifier une huiles
 *
 */
router.patch("/essential/:id", auth.checkToken, auth.isAdmin, oilController.updateOilById);

/**
 * DELETE /essential - route supprimer une huile
 * Pour la méthode DELETE il est important d'inclure 
 * l'ID car nous voulons supprimer une ressource existante dans la base de données qui a un ID.
 */
router.delete("/essential/:id", auth.checkToken, auth.isAdmin, oilController.deleteOilById);

module.exports = router;
