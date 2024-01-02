const { familyModel } = require("../models");
const logger = require("../service/logger");

const chalk = require("chalk");

const categoryController = {
  async getAllFamilies(req, res) {
    try {
      const families = await familyModel.getFamilies();
      console.log(chalk.bgBlue("{ families }>>>>>>", families));

      if (!families) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `Erreur lors de l'envoi des familles `,
        });
        res.status(500).json({ message: `Erreur lors de l'envoi des familles` });
      }
      res.status(200).json(families);
    } catch (err) {
      console.error( `Erreur lors de l'envoi de toutes les familles: ${err.message}`);

      res.status(500).json({ message: `Les famille sont introuvable` });
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `Les famille sont introuvable`
      });
    }
  },


  async getFamilyById(req, res) {
    const familyId = req.params.id;
    console.log(chalk.bgBlue("{ family }>>>>>>", familyId));

    try {
      const family = await familyModel.getOneFamilyById(familyId);

      if (!family) {
        res.status(500).json({
          message: `La famille avec l'id ${familyId} n'a pas été trouvée`,
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
        chalk.bgRedBright(`Erreur lors de l'envoi de la famille: ${err.message}`));

        res.status(500).json({ message: `la famille ${familyId} est introuvable` });
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `la famille ${familyId} est introuvable `
        });
    }
  },


  async createFamily(req, res) {
    const familyName = req.body.name;
    console.log(chalk.bgBlue("{ req Body }>>>>>>", familyName));

    if (!familyName) {
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `Vous devez renseigner le nom de la famille`,
      });
      return res.status(500).json({ message: `Vous devez renseigner le nom de la famille` });
    }

    try {
      const family = await familyModel.insertFamily(familyName);
      res.status(200).json({ Message: `Vous avez crée la famille: ${familyName}`});

    } catch (err) {
      console.error(
        chalk.bgRedBright(`Erreur lors de la creation de la famille: ${err.message}`)
      );
      res.status(500).json({ message: `Le nom de la famille existe déja` });

      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `Le nom de la famille existe déja`,
      });
    }
  },


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
      return res.status(500).json({ message: `Tous les champs doivent être remplis` });}

    try {
      const updatefamily = await familyModel.updateOneFamily(familyId, name);
      console.log(chalk.bgBlue("{ family }>>>>>>", updatefamily));

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

  async deleteFamily (req, res) {
   // récupére l'id de l'huile
   const familyId = req.params.id;
   console.log(chalk.bgBlack("{ familyId }>>>>>>", familyId));

   try {
     const family = await familyModel.deleteOneFamily(familyId);
     const familyName = family.name;
     console.log(chalk.bgGreen("oilName>>>>>>", familyName));

     res.status(201).json({ Message: `la famille ${familyName} a bien été supprimée ` });
   } catch (err) {
     console.error(
       chalk.bgRedBright(`Erreur lors de la suppression de l'huile avec l'id: ${familyId}`));
       
     res.status(500).json({ message:`Erreur lors de la suppression de l'huile avec l'id: ${familyId}`});

     logger.customerLogger.log("error", {
       url: req.url,
       method: req.method,
       message: `Erreur lors de la suppression de l'huile avec l'id: ${familyId}`
     });
   }
 }
};

module.exports = categoryController;
