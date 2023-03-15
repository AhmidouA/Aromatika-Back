const { familyModel } = require("../models");
// logger des erreurs client
const logger = require("../service/logger");
// la seul qui marche avec require  "chalk": "^4.1.2",
const chalk = require("chalk");



const categoryController = {
  // Méthode pour avoir toutes les familles
  async getAllFamilies(req, res) {

    try {
      // on récupère les nom des familles
      const families = await familyModel.getFamilies();
      //  console.log(chalk.bgBlue("{ families }>>>>>>", families))
      // condition si il ne trouve pas
      if (!families) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: "Erreur lors de l'envoi des familles ",
        });
        res
          .status(500)
          .json({ message: "Erreur lors de l'envoi des familles" });
      }
      res.status(200).json(families);
    } catch (err) {
      console.error(
        `Erreur lors de l'envoi de toutes les familles: ${err.message}`
      );
    }
  },
};

module.exports = categoryController;
