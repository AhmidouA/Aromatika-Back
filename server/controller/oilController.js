const { oilModel } = require("../models");

const oilController = {
  // Methode pour récupèrer les données d'une huile
  async getOilById(req, res) {
     // on récuepre l'id de huile en params
    const { id } = req.params;
    // console.log("{ id }>>>>>>", { id })
    try {
      const oil = await oilModel.getOneOilById(id);
      // console.log("{ oil }>>>>>>", oil)
      res.status(200).json(oil);
    } catch (err) {
      console.error(
        `Erreur lors de l'envoi de l'huile: ${err.message}`
      );
      res.status(500).json({ message: "Erreur serveur" });
    }
  },

   // Methode pour créer une huile
   async createOil(req, res) {
    const {
      name,
      botanic_name,
      description,
      extraction,
      molecule,
      plant_family,
      scent,
      image,
    } = req.body;
    //  console.log("{ req Body }>>>>>>", {  name, botanic_name, description, extraction, molecule, plant_family, scent, image })

    // Vérifier que toutes les données (not null) sont présentes
    if (!name || !botanic_name || !description || !extraction || !molecule || !plant_family || !scent) {
      return res.status(400).json({ message: "Tous les champs doivent être remplis" });
    }

    try {
      // Appel de la méthode du modèle (dataMapper) pour inserer unee huile
      const oil = await oilModel.insertOil(req.body);
      res.status(201).json(oil);
    } catch (err) {
      console.error(
        `Erreur lors de la creation de l'huile: ${err.message}`
      );
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
   // Methode pour modifie une huile
   async updateOilById(req, res, ) {
    // récupére l'id de l'huile
    const { id } = req.params;
    // console.log("{ id }>>>>>>", id)
    const {
      name,
      botanic_name,
      description,
      extraction,
      molecule,
      plant_family,
      scent,
      image,
    } = req.body;
    console.log("{ req Body }>>>>>>", {  name, botanic_name, description, extraction, molecule, plant_family, scent, image, })

    // Vérifier que toutes les données (not null) sont présentes
    if (!name || !botanic_name || !description || !extraction || !molecule || !plant_family || !scent) {
      return res.status(400).json({ message: "Tous les champs doivent être remplis" });
    }

    try {
      // Appel de la méthode du modèle (dataMapper) pour modifier unee huile
      const updatedOil = await oilModel.updateOneOil(id, req.body);
      res.status(200).json(updatedOil);
    } catch (err) {
      console.error(
        `Erreur lors de la modification de l'huile: ${err.message}`
      );
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
  // Methode pour supprime une huile
  async deleteOilById(req, res) {
     // récupére l'id de l'huile
    const oilId = req.params.id;
    // console.log("{ id }>>>>>>", id)

    try {
      // Appel de la méthode du modèle (dataMapper) pour supprimer unee huile
      const oil = await oilModel.deleteOneOil(oilId);
      const oilName = oil.name;
      // console.log("oilName>>>>>>", oilName);
      res.status(201).json({Message: `l' huile ${oilName} a bien été supprimée `,
      });
    } catch (err) {
      console.error(
        `Erreur lors de la suppression de l'huile: ${err.message}`
      );
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
};

module.exports = oilController;
