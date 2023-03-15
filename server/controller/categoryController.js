const { categoryModel } = require("../models");
// logger des erreurs client
const logger = require("../service/logger");
// la seul qui marche avec require  "chalk": "^4.1.2",
const chalk = require("chalk");

const categoryController = {
  // Méthode pour avoir toutes les catégorie
  async getAllCategories(req, res) {
    // on récuepre le nom de famille des catégories en params
    const family = req.params.family;
    console.log(chalk.bgBlue("{ family }>>>>>>", family));

    try {
      // // Appel de la méthode du modèle (dataMapper) pour donner toutes les catégorie
      const categories = await categoryModel.GetCategories(family);
      console.log(chalk.bgGreen("{ categories }>>>>>>", categories));

      if (!categories) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: "Erreur lors de l'envoi des catégories ",
        });
        res
          .status(500)
          .json({ message: "Erreur lors de l'envoi des catégories" });
      }
      res.status(200).json(categories);
    } catch (err) {
      console.error(
        `Erreur lors de l'envoi de toutes les catégories: ${err.message}`
      );
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: "Erreur lors de l'envoi des catégories ",
      });
    }
  },

  // Méthode pour donner une catégorie avec ses huiles
  async getOneCategories(req, res) {
    const id = req.params.id;
    console.log(chalk.bgBlue("{ id }>>>>>>", id));

    try {
      // Appel de la méthode du modèle (dataMapper) pour donner une catégorie
      const category = await categoryModel.getOneCategory(id);
      console.log(chalk.bgGreen("category>>>>>>", category));

      // Appel de la méthode du modèle (dataMapper) pour donner toutes les huile d'une catégorie
      const categoryWithOil = await categoryModel.getOneCategoryWithOil(id);
      console.log(chalk.bgCyan("categoryWithOil>>>>>>", categoryWithOil));

      if (!category) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `La catégorie avec l'id ${id} n'a pas été trouvée.`,
        });
        res
          .status(500)
          .json({
            message: `La catégorie avec l'id ${id} n'a pas été trouvée.`,
          });
      }
      res
        .status(200)
        .json({
          category_id: category.id,
          category_name: category.name,
          category_description: category.description,
          categoryWithOil,
        });
    } catch (err) {
      console.error(`Erreur lors de l'envoi d'une catégorie: ${err.message}`);
    }
  },

  // Méthode pour ajouter une catégorie
  async addCategory(req, res) {
    const name = req.body;
    console.log(chalk.bgBlue("{ name }>>>>>>", Object.values(name)));

    try {
      // Appel de la méthode du modèle (dataMapper) pour inserer une catégorie
      const category = await categoryModel.insertCategory(name);
      console.log(chalk.bgGreen("category>>>>>>", category));
      res.status(200).json(category.rows[0]);
    } catch (err) {
      console.error(
        `Erreur lors de la création de la catégorie: ${err.message}`
      );
      res
        .status(500)
        .json({ error: "Erreur serveur lors de la création de la catégorie" });
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message:
          "Erreur serveur lors de la création de la catégorie " +
          Object.values(name),
      });
    }
  },

  // Méthode pour mettre à jour une catégorie
  async updateCategory(req, res) {
    const name = req.body.name;
    const categoryId = req.params.id;
    console.log(chalk.bgYellow("categoryId>>>>>>", categoryId));
    console.log(chalk.bgBlue("{ name }>>>>>>", name));

    try {
      // Appel de la méthode du modèle (dataMapper) pour mettre à jour la catégorie
      const result = await categoryModel.updateOneCategory(categoryId, name);
      // console.log(chalk.bgGreen("result>>>>>>", result));

      // vérifie qui il trouve au moins une catégorie
      if (result.rowCount > 0) {
        res.status(200).json({message: `La catégorie ${name.name} a bien été mise à jour avec succès`});
      } else {
        res.status(500).json({message:"La catégorie " + name + " est introuvable et son id est le: " + categoryId});
        
        logger.customerLogger.log("error", {
              url: req.url,
              method: req.method,
              message:"La catégorie " + name + " est introuvable et son id est le: " + categoryId});
        }
    } catch (err) {
      console.error(
        `Erreur lors de la modification de la catégorie: ${err.message}`
      );
      res
        .status(500)
        .json({ message: `La catégorie ${name.name} existe déja` });
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: "La catégorie " + name.name + " existe déja",
      });
    }
  },

  // Méthode pour supprimer une catégorie
  async deleteCategory(req, res) {
    const categoryId = req.params.id;
    console.log(chalk.bgBlue("categoryId>>>>>>", categoryId));

    try {
      // Récupérer la catégorie avant de la supprimer
      const category = await categoryModel.getOneCategory(categoryId);
      // console.log(chalk.bgGreen("category>>>>>>", category));
      const categoryName = category.name;
      console.log(chalk.bgGreen("categoryName>>>>>>", categoryName));

      // Supprimer la catégorie
      const result = await categoryModel.deleteOneCategory(categoryId);
      res
        .status(200)
        .json({
          Message: `la catégorie ${categoryName} a bien été supprimée `,
        });
    } catch (err) {
      console.error(
        `Erreur lors de la suppression de la catégorie: ${err.message}`
      );
      res
        .status(500)
        .json({
          message:
            "Erreur lors de la suppression de la catégorie avec l'id: " +
            categoryId,
        });
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message:
          "Erreur lors de la suppression de la catégorie avec l'id: " +
          categoryId,
      });
    }
  },
};

module.exports = categoryController;
