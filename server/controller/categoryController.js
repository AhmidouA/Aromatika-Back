const { categoryModel } = require("../models");

const categoryController = {
  async getAllCategories(req, res) {
    // on récuepre le nom de famille des catégories en params
    const family = req.params.family;
    // console.log("family>>>>>>", family)

    try {
      // on envoi le paramattre du nom de la famille dans la methode GetCategories() (=> dataMapper)
      const categories = await categoryModel.GetCategories(family);
      // console.log("categories>>>>>>", categories)

      res.status(200).json(categories);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
  async getOneCategories(req, res) {
    const id = req.params.id;
    console.log("id>>>>>>", id);

    try {
      const category = await categoryModel.GetOneCategory(id);
      console.log("category>>>>>>", category);

      res.status(200).json(category);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
  async addCategory(req, res) {
    const { name } = req.body;
    console.log("name>>>>>>", name);

    try {
      // On insère la catégorie en base de données en utilisant la méthode
      const result = await categoryModel.insertCategory({ name });
      console.log("result>>>>>>", result);
      res.status(200).json({ message: "Catégorie créée" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
};

module.exports = categoryController;
