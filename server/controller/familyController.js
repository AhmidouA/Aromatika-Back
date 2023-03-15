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
      console.log(chalk.bgBlue("{ families }>>>>>>", families));

      // condition si il ne trouve pas
      if (!families) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `Erreur lors de l'envoi des familles `,
        });
        res
          .status(500)
          .json({ message: `Erreur lors de l'envoi des familles` });
      }
      res.status(200).json(families);
    } catch (err) {
      console.error(
        `Erreur lors de l'envoi de toutes les familles: ${err.message}`
      );
    }
  },

  // module avoir une famille par Id
  async getFamilyById(req, res) {
    const familyId = req.params.id;
    console.log(chalk.bgBlue("{ family }>>>>>>", familyId));

    try {
      const family = await familyModel.getOneFamilyById(familyId);
      // console.log(chalk.bgGreen("{ family }>>>>>>", family));

      // Si aucune famille n'a été trouvée, enregistrement de l'erreur dans les logs et
      //renvoi d'une réponse avec un message d'erreur
      if (!family) {
        res.status(500).json({
          message: `La famille avec l'id ${familyId} n'a pas été trouvée.`,
        });
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `La famille avec l'id ${familyId} n'a pas été trouvée`,
        });
      }
      res.status(200).json({ Message: "La famille: " + family.name });
    } catch (err) {
      console.error(
        chalk.bgRedBright(
          `Erreur lors de l'envoi de la famille: ${err.message}`
        )
      );
    }
  },

  // Module creation d'une famille
  async createFamily(req, res) {
    const familyName = req.body.name;
    console.log(chalk.bgBlue("{ req Body }>>>>>>", familyName));

    // Vérifier que toutes les données (not null) sont présentes
    if (!familyName) {
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `Vous devez renseigner le nom de la famille`,
      });
      return res
        .status(500)
        .json({ message: `Vous devez renseigner le nom de la famille` });
    }

    try {
      // Appel de la méthode du modèle (dataMapper) pour inserer unee huile
      const family = await familyModel.insertFamily(familyName);
      // console.log(chalk.bgGreen(family));

      res
        .status(200)
        .json({ Message: `Vous avez crée la famille: ${familyName}`});
    } catch (err) {
      console.error(
        chalk.bgRedBright(
          `Erreur lors de la creation de la famille: ${err.message}`
        )
      );
      res.status(500).json({ message: `Le nom de la famille existe déja` });

      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `Le nom de la famille existe déja`,
      });
    }
  },

  // Module pour update une famille
  async updateFamily(req, res) {
    const name = req.body.name;
    const familyId = req.params.id;
    console.log(chalk.bgBlue("{ name }>>>>>>", name));
    console.log(chalk.bgBlue("{ familyId }>>>>>>", familyId));

    if (!name) {
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `Tous les champs doivent être remplis`,
      });
      return res.status(400).json({ message: `Tous les champs doivent être remplis` });}

    try {
      // Appel de la méthode du modèle (dataMapper) pour mettre à jour la catégorie
      const updatefamily = await familyModel.updateOneFamily(familyId, name);
      console.log(chalk.bgBlue("{ family }>>>>>>", updatefamily));

      // Cheek au moins si une famille existe 
      if (!updatefamily) {
        return res.status(500).json({message:`La famille ${name} est introuvable et son id est le: ${familyId}`});
      }

      res.status(200).json({Message: "La famille a bien été modfié " + name});
       
    } catch (err) {
      console.error(`Erreur lors de la modification de la famille: ${err.message}`);
      res.status(500).json({ message: `La famille ${name} existe déja` });
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `La famille ${name} existe déja`,
      });
    }
  },
};

module.exports = categoryController;
