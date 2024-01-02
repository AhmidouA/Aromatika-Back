const { dbClient } = require("../service");

const categoryModel = {
  async GetCategories(familyName) {
    const sqlCheckQuery = ` SELECT category.id, category.name 
        FROM category 
        JOIN family_has_category ON category.id = family_has_category.category_id 
        JOIN family ON family_has_category.family_id = family.id 
        WHERE family.name = $1;`;

    const values = [familyName];

    try {
      const result = await dbClient.query(sqlCheckQuery, values);
      return result.rows;
    } catch (err) {
      throw new Error(
        `Erreur lors de la récupération des catégories ${err.message}`
      );
    }
  },

  async getOneCategory(id) {
    const sqlCheckQuery = `SELECT * FROM category WHERE id = $1;`;

    const values = [id];
    console.log("id>>>>>>>>>>>", id);

    try {
      const result = await dbClient.query(sqlCheckQuery, values);
      console.log("result>>>>>>>>>>>", result);
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Erreur lors de la récupération de la catégorie ${err.message}`
      );
    }
  },

  async getOneCategoryWithOil(id) {
    const sqlQueryCatByOil = `
    SELECT category.id, category.name, category.description,
    oil.id, oil.name, oil.description
    FROM category
    JOIN oil_has_category ON category.id = oil_has_category.category_id
    JOIN oil ON oil.id = oil_has_category.oil_id
    WHERE category.id = $1
    `;

    const values = [id];

    try {
      const result = await dbClient.query(sqlQueryCatByOil, values);

      const resulCat = result.rows;
      return resulCat;
    } catch (err) {
      throw new Error(
        `Erreur lors de la récupération de la catégorie ${err.message}`
      );
    }
  },

  async insertCategory(category) {
    const sqlQueryCategory = `INSERT INTO category (name) VALUES ($1) RETURNING id`;

    const sqlQueryCategoryFamily = `INSERT INTO family_has_category (family_id, category_id, name) VALUES ($1, $2, $3) RETURNING *`;

    const sqlQueryFamily = "SELECT id FROM family WHERE name = $1";

    const familyNameAutoValues = ["essential"];

    const valuesCategory = [category.name];
    console.log("valuesCategory>>>>>>>>>>>", valuesCategory);

    try {
      const familyResultQuery = await dbClient.query(
        sqlQueryFamily,
        familyNameAutoValues
      );

      const familyId = familyResultQuery.rows[0].id;

      const categoryResult = await dbClient.query(
        sqlQueryCategory,
        valuesCategory
      );

      const categoryId = categoryResult.rows[0].id;

      const categoryName = valuesCategory[0];

      const regroupFamilyCategorieValue = [familyId, categoryId, categoryName];

      const familyResult = await dbClient.query(
        sqlQueryCategoryFamily,
        regroupFamilyCategorieValue
      );

      return familyResult;
    } catch (err) {
      throw new Error(
        `Erreur lors de la création de la catégorie ${err.message}`
      );
    }
  },

  async updateOneCategory(id, familyName) {
    const sqlQuery = `UPDATE category SET name = $1 WHERE id = $2;`;

    const values = [familyName, id];
    console.log("values>>>>>>>>>>>", values);

    try {
      const result = await dbClient.query(sqlQuery, values);
      console.log("response>>>>>>>>>>>", result);
      return result;
    } catch (err) {
      throw new Error(`
    Erreur lors de la mise à jour de la catégorie ${err.message}`);
    }
  },

  async deleteOneCategory(id) {
    const deleteFamilyHasCategoryQuery = `DELETE FROM family_has_category WHERE category_id=$1`;
    const categoryValuesId = [id];
    console.log("categoryValuesId>>>>>>>>>>>", categoryValuesId);

    try {
      await dbClient.query(deleteFamilyHasCategoryQuery, categoryValuesId);

      const sqlQueryCategory = `DELETE FROM category WHERE id=$1;`;
      const result = await dbClient.query(sqlQueryCategory, categoryValuesId);

      const deletedCategory = result.rows[0];

      return deletedCategory;
    } catch (err) {
      throw new Error(
        `Erreur lors de la suppression de la catégorie: ${err.message}`
      );
    }
  },
};

module.exports = categoryModel;
