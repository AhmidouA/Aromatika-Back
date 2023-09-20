const { oilModel } = require("../models");
// logger des erreurs client
const logger = require("../service/logger");
// la seul qui marche avec require  "chalk": "^4.1.2",
const chalk = require("chalk");

const oilController = {
  // Methode pour récupèrer les données d'une huile
  async getOilById(req, res) {
    // on récuepre l'id de huile en params
    const oilId = req.params.id;
    console.log(chalk.bgBlue("{ oilId }>>>>>>", oilId));
    try {
      const oil = await oilModel.getOneOilById(oilId);
      console.log(chalk.bgGreen("{ oil }>>>>>>", oil));

      // Si aucune huile n'a été trouvée, enregistrement de l'erreur dans les logs et
      //renvoi d'une réponse avec un message d'erreur
      if (!oil) {
        res.status(500).json({ message: `Huile avec l'id ${oilId} n'a pas été trouvée.` });

        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `Huile avec l'id ${oilId} n'a pas été trouvée`,
        });
      }
      res.status(200).json(oil);
    } catch (err) {
      console.error(
        chalk.bgRedBright(`Erreur lors de l'envoi de l'huile: ${err.message}`));

        res.status(500).json({ message: `l'huile ${oilId} est introuvable` });
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `l'huile ${oilId} est introuvable`
        });
    }
  },


  // Methode pour créer une huile
  async createOil(req, res) {
    const {name,botanic_name,description,extraction,molecule,plant_family,scent,image} = req.body;
    console.log(
      chalk.bgBlue("{ req Body }>>>>>>",Object.values({name,botanic_name,description,extraction,molecule,plant_family,scent,image
        })
      )
    );

    // Vérifier que toutes les données (not null) sont présentes
    if (!name ||!botanic_name ||!description ||!extraction ||!molecule ||!plant_family ||!scent) {
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `Tous les champs n'ont pas été remplis`,
      });
      return res.status(400).json({ message: `Tous les champs doivent être remplis` });
    }

    try {
      // Appel de la méthode du modèle (dataMapper) pour inserer unee huile
      const oil = await oilModel.insertOil(req.body);
      console.log(chalk.bgGreen("oil Dans create Oil", oil));
      res.status(201).json(oil);

    } catch (err) {
      console.error(

      chalk.bgRedBright(`Erreur lors de la creation de l'huile: ${err.message}`));
      res.status(500).json({ message: `Le nom ou le nom botanique existent déja` });
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `Le nom ou le nom botanique existent déja`,
      });
    }
  },

  // Methode pour modifie une huile
  async updateOilById(req, res) {
    // récupére l'id de l'huile
    const { id } = req.params;
    console.log(chalk.bgGreen(("{ id }>>>>>>", id)));
    const {name,botanic_name,description,extraction,molecule,plant_family,scent,image} = req.body;
    console.log(
      chalk.bgBlue(
        "{ req Body }>>>>>>",
        Object.values({name,botanic_name,description,extraction,molecule,plant_family,scent,image})
      )
    );

    // Vérifier que toutes les données (not null) sont présentes
    if (!name ||!botanic_name ||!description ||!extraction ||!molecule ||!plant_family ||!scent ) {
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `Tous les champs doivent être remplis`
      });
      return res.status(400).json({ message: `Tous les champs doivent être remplis` });}

    try {

      // Appel de la méthode du modèle (dataMapper) pour modifier unee huile
      const updatedOil = await oilModel.updateOneOil(id, req.body);
      console.log(chalk.green(updatedOil));
      res.status(200).json({Message: `L'huile a bien été modfié ${updatedOil}`});
    } catch (err) {
      console.error(
        chalk.bgRedBright(
          `Erreur lors de la modification de l'huile: ${err.message} l'id ${id}`));

      res.status(500).json({ message: `Erreur lors de la modification de l'huile: ${id}`});
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `Erreur lors de la modification de l'huile: ${id}`,
      });
    }
  },

  // Methode pour supprime une huile
  async deleteOilById(req, res) {
    // récupére l'id de l'huile
    const oilId = req.params.id;
    console.log(chalk.bgBlack("{ oilId }>>>>>>", oilId));

    try {
      // Appel de la méthode du modèle (dataMapper) pour supprimer unee huile
      const oil = await oilModel.deleteOneOil(oilId);
      const oilName = oil.name;
      console.log(chalk.bgGreen("oilName>>>>>>", oilName));

      res.status(201).json({ Message: `l' huile ${oilName} a bien été supprimée ` });
    } catch (err) {
      console.error(
        chalk.bgRedBright(`Erreur lors de la suppression de l'huile avec l'id: ${oilId}`));

      res.status(500).json({message:`Erreur lors de la suppression de l'huile avec l'id: ${oilId}`});
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `Erreur lors de la suppression de l'huile avec l'id: ${oilId}`,
      });
    }
  }
};

module.exports = oilController;
