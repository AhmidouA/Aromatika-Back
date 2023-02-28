const { categoryModel } = require("../models");

const categoryController = {
  // Méthode pour avoir toutes les catégorie
  async getAllCategories(req, res) {
    // on récuepre le nom de famille des catégories en params
    const family = req.params.family;
    // console.log("family>>>>>>", family)

    try {
      // // Appel de la méthode du modèle (dataMapper) pour donner toutes les catégorie
      const categories = await categoryModel.GetCategories(family);
      // console.log("categories>>>>>>", categories)

      res.status(200).json(categories);
    } catch (err) {
      console.error(err);
      console.error(
        `Erreur lors de l'envoi de toutes les catégories: ${err.message}`
      );
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
  // Méthode pour donner une catégorie
  async getOneCategories(req, res) {
    const id = req.params.id;
    console.log("id>>>>>>", id);

    try {
      // Appel de la méthode du modèle (dataMapper) pour donner une catégorie
      const category = await categoryModel.GetOneCategory(id);
      console.log("category>>>>>>", category);

      res.status(200).json(category);
    } catch (err) {
      console.error(`Erreur lors de l'envoi d'une catégorie: ${err.message}`);
      res.status(500).json({ message: "Erreur serveur" });
    }
  },

  // Méthode pour ajouter une catégorie
  async addCategory(req, res) {
    const name = req.body;

    try {
      // Appel de la méthode du modèle (dataMapper) pour inserer une catégorie
      const category = await categoryModel.insertCategory(name);
      res.status(201).json(category.rows[0]);
    } catch (err) {
      console.error(
        `Erreur lors de la création de la catégorie: ${err.message}`
      );
      res
        .status(500)
        .json({ error: "Erreur serveur lors de la création de la catégorie" });
    }
  },

  // Méthode pour mettre à jour une catégorie
  async updateCategory(req, res) {
    const name = req.body;
    const categoryId = req.params.id;
    console.log("categoryId>>>>>>", categoryId);
    console.log("name>>>>>>", name);

    try {
      // Appel de la méthode du modèle (dataMapper) pour mettre à jour la catégorie
      const result = await categoryModel.updateOneCategory(categoryId, name);
      console.log("result>>>>>>", result);

      // vérifie qui il trouve au moins une catégorie
      if (result.rowCount > 0) {
        res.status(200).json({ message: "Catégorie mise à jour avec succès" });
      } else {
        res.status(404).json({ message: "Catégorie introuvable" });
      }
    } catch (err) {
      console.error(err);
      console.error(
        `Erreur lors de la modification de la catégorie: ${err.message}`
      );
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
};

module.exports = categoryController;
