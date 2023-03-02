const { dbClient } = require("../service");

const oilModel = {
  // Methode pour avoir un huile par Id
  async getOneOilById(id) {
    // requête pour récupérer une l'huile
    const query = "SELECT * FROM oil WHERE id = $1;";
    // je stock tout dans un tableau
    const values = [id];

    try {
      // exécution de la requête
      const result = await dbClient.query(query, values);
      console.log("result>>>>>>>>>>>", result);
      // renvoi la 1er ligne du resultat trouvé ('huile demandée)
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Erreur lors de la recupération de la Huile: ${err.message}`
      );
    }
  },

  // Méthode pour créer une nouvelle huile
  async insertOil(data) {
    const query =
      "INSERT INTO oil(name, botanic_name, description, extraction, molecule, plant_family, scent, image) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;";
    const values = [
      data.name,
      data.botanic_name,
      data.description,
      data.extraction,
      data.molecule,
      data.plant_family,
      data.scent,
      data.image,
    ];

    console.log("values>>>>>>>", values);

    try {
      // exécution de la requête
      const result = await dbClient.query(query, values);
      // renvoi la 1er ligne du résultat, (huile créée)
      return result.rows[0];
    } catch (err) {
      throw new Error(`Erreur lors de la création de l'huile : ${err.message}`);
    }
  },

  // Méthode pour mettre à jour une huile
  async updateOneOil(id, data) {
    const query =
      "UPDATE oil SET name=$1, botanic_name=$2, description=$3, extraction=$4, molecule=$5, plant_family=$6, scent=$7, image=$8, updated_at=NOW() WHERE id=$9 RETURNING *;";
    const values = [
      data.name,
      data.botanic_name,
      data.description,
      data.extraction,
      data.molecule,
      data.plant_family,
      data.scent,
      data.image,
      id,
    ];

    try {
      const result = await dbClient.query(query, values);
      // renvoi la 1er ligne du résultat (l'huile modifiée)
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Erreur lors de la mise à jour de l'huile : ${err.message}`
      );
    }
  },

  // Méthode pour supprimer une huile
  async deleteOneOil(id) {
    const query = "DELETE FROM oil WHERE id = $1 RETURNING *;";
    const values = [id];

    try {
      const result = await dbClient.query(query, values);
      // renvoi la 1er ligne du résultat (l'huile supprimé)
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Erreur lors de la suppression de l'huile : ${err.message}`
      );
    }
  },
};

module.exports = oilModel;
