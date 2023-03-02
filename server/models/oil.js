const { dbClient } = require("../service");

const oilModel = {
  // Methode pour avoir un huile par Id
  async getOilById(id) {
    // requête pour récupérer une l'huile
    const query = "SELECT * FROM oil WHERE id = $1;";
    // je stock tout dans un tableau
    const values = [id];

    try {
      // exécution de la requête
      const result = await dbClient.query(query, values);
      console.log("result>>>>>>>>>>>", result);
      // renvoi de la première
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Erreur lors de la recupération de la Huile: ${err.message}`
      );
    }
  },
};

module.exports = oilModel;
