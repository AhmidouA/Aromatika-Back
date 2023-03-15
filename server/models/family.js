const { dbClient } = require("../service");

const familyModel = {
  // Méthode pour avoir toutes les familles de la base de données
  async getFamilies() {
    const sqlQuery = ` SELECT * FROM family;`;
       // console.log("sqlQuery>>>>>>>", sqlQuery);
    // console.log("sqlQuery>>>>>>>", values);

    try {
      const result = await dbClient.query(sqlQuery);
      // console.log("result>>>>>>>>>>>", result);
      return result.rows;
    } catch (err) {
      throw new Error(
        `Erreur lors de la récupération des familles ${err.message}`
      );
    }
  },


  // Méthode pour avoir une famille par son id de la base de données
  async getOneFamilyById(id) {
    const sqlQuery = ` SELECT * FROM family WHERE id=$1;`;
    const values = [id];
    // console.log("sqlQuery>>>>>>>>>>>", sqlQuery);
    // console.log("values>>>>>>>>>>>", values);

    try {
      // On exécute la requête SQL avec les valeurs définies
      const result = await dbClient.query(sqlQuery, values);
      // console.log("result>>>>>>>>>>>", result);
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Erreur lors de la récupération de la famille ${err.message}`
      );
    }
  },


  // Méthode pour avoir creer une famille dans la base de données
  async insertFamily(data) {
    const sqlQuery = `INSERT INTO family (name) VALUES ($1);`;
    const values = [data];

    // console.log("sqlQuery>>>>>>>", sqlQuery);
    // console.log("sqlQuery>>>>>>>", values);

    try {
      // exécution de la requête
      const result = await dbClient.query(sqlQuery, values);
      // console.log("result>>>>>>>", result.rows[0]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Erreur lors de la création de la famille : ${err.message}`);
    }
  },


  // Méthode pour modifier une famille de la base de données
  async updateOneFamily (id, data){
    const sqlQuery = `UPDATE family SET name = $1, updated_at=NOW() WHERE id=$2 RETURNING *;`;
    const values = [data, id]
    // console.log("sqlQuery>>>>>>>", sqlQuery);
    // console.log("sqlQuery>>>>>>>", values);

    try {
      // exécution de la requête
      const result = await dbClient.query(sqlQuery, values);
      // console.log("result>>>>>>>", result.rows[0]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Erreur lors de la modification de la famille : ${err.message}`);
    }
  },



  // Méthode pour supprimer une famille de la base de données
  async deleteOneFamily(id) {
    const query = "DELETE FROM family WHERE id = $1 RETURNING *;";
    const values = [id];
    // console.log("sqlQuery>>>>>>>", sqlQuery);
    // console.log("sqlQuery>>>>>>>", values);

    try {
      const result = await dbClient.query(query, values);
      // console.log("result>>>>>>>", result.rows[0]);
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Erreur lors de la suppression de l'huile : ${err.message}`
      );
    }
  },
};

module.exports = familyModel;
