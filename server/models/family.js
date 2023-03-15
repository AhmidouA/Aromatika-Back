const { dbClient } = require("../service");




const familyModel = {
  // Méthode pour avoir toutes les familles de la base de données
  async getFamilies() {

    // On définit la requête qui va récupérer les familles demandées
    const sqlCheckQuery = ` SELECT * FROM family;`;
    //  console.log(sqlCheckQuery);

    try {
      // On exécute la requête SQL avec les valeurs définies
      const result = await dbClient.query(sqlCheckQuery);
      // console.log("result>>>>>>>>>>>", result);
      return result.rows;
    } catch (err) {
      throw new Error(
        `Erreur lors de la récupération des familles ${err.message}`
      );
    }
  },
};

module.exports = familyModel;
