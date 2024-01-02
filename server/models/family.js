const { dbClient } = require("../service");

const familyModel = {
  async getFamilies() {
    const sqlQuery = ` SELECT * FROM family;`;

    try {
      const result = await dbClient.query(sqlQuery);

      return result.rows;
    } catch (err) {
      throw new Error(
        `Erreur lors de la récupération des familles ${err.message}`
      );
    }
  },

  async getOneFamilyById(id) {
    const sqlQuery = ` SELECT * FROM family WHERE id=$1;`;
    const values = [id];

    try {
      const result = await dbClient.query(sqlQuery, values);

      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Erreur lors de la récupération de la famille ${err.message}`
      );
    }
  },

  async insertFamily(data) {
    const sqlQuery = `INSERT INTO family (name) VALUES ($1);`;
    const values = [data];

    try {
      const result = await dbClient.query(sqlQuery, values);

      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Erreur lors de la création de la famille : ${err.message}`
      );
    }
  },

  async updateOneFamily(id, data) {
    const sqlQuery = `UPDATE family SET name = $1, updated_at=NOW() WHERE id=$2 RETURNING *;`;
    const values = [data, id];

    try {
      const result = await dbClient.query(sqlQuery, values);

      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Erreur lors de la modification de la famille : ${err.message}`
      );
    }
  },

  async deleteOneFamily(id) {
    const query = "DELETE FROM family WHERE id = $1 RETURNING *;";
    const values = [id];

    try {
      const result = await dbClient.query(query, values);

      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Erreur lors de la suppression de l'huile : ${err.message}`
      );
    }
  },
};

module.exports = familyModel;
