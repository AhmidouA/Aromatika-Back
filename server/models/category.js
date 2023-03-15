const { dbClient } = require("../service");




const categoryModel = {
  // Méthode pour avoir toutes catégorie d'une famille de la base de données
  async GetCategories(familyName) {
    // console.log("familyName>>>>>>>>>>>", familyName)

    // On définit la requête qui va récupérer les catégories de la famille demandée
    const sqlCheckQuery = ` SELECT category.id, category.name 
        FROM category 
        JOIN family_has_category ON category.id = family_has_category.category_id 
        JOIN family ON family_has_category.family_id = family.id 
        WHERE family.name = $1;`;

    const values = [familyName];
    // console.log("values>>>>>>>>>>>", values)

    try {
      // On exécute la requête SQL avec les valeurs définies
      const result = await dbClient.query(sqlCheckQuery, values);
      // console.log("result>>>>>>>>>>>", result)

      // On retourne les catégories récupérées sous forme de tableau d'objets rows
      return result.rows;
    } catch (err) {
      throw new Error(
        `Erreur lors de la récupération des catégories ${err.message}`
      );
    }
  },

  // Méthode pour donner une catégorie dans la base de données
  async getOneCategory(id) {
    // Requête pour récupérer une catégorie dans la table category
    const sqlCheckQuery = `SELECT * FROM category WHERE id = $1;`;
    // console.log("sqlCheckQuery>>>>>>>>>>>", sqlCheckQuery);
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
    // Requête pour récupérer toutes les huiles d'une catégorie
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
      // console.log("result>>>>>>>>>>>", result)
      const resulCat = result.rows;
      return resulCat;
    } catch (err) {
      throw new Error(
        `Erreur lors de la récupération de la catégorie ${err.message}`
      );
    }
  },

  // Méthode pour inserer une catégorie dans la base de données
  async insertCategory(category) {
    // Requête pour insérer une nouvelle catégorie dans la table category
    const sqlQueryCategory = `INSERT INTO category (name) VALUES ($1) RETURNING id`;
    // Requête  pour insérer une nouvelle catégorie dans la table family_has_category,
    // qui relie la famille passée à la nouvelle catégorie créée
    const sqlQueryCategoryFamily = `INSERT INTO family_has_category (family_id, category_id, name) VALUES ($1, $2, $3) RETURNING *`;
    // Requête pour insérer id famille (family_id) de la nouvelle catégorie
    const sqlQueryFamily = "SELECT id FROM family WHERE name = $1";
    // la requête pour lui insere automatiquement l'id a la famille "essential" =  family_id = 1
    // Valeur de la famille "essential"
    const familyNameAutoValues = ["essential"];

    // valeur pour la catégorie (Not Null) est le nom
    const valuesCategory = [category.name];
    console.log("valuesCategory>>>>>>>>>>>", valuesCategory);

    try {
      // la requête pour récupérer l'ID de la famille "Essential"
      const familyResultQuery = await dbClient.query(
        sqlQueryFamily,
        familyNameAutoValues
      );
      // Récupérer de l'ID de la famille "Essential"
      const familyId = familyResultQuery.rows[0].id;

      // Exécution de la requête pour insérer une nouvelle catégorie dans la table "category"
      const categoryResult = await dbClient.query(
        sqlQueryCategory,
        valuesCategory
      );
      // Récupérer de l'ID de la catégorie créée
      const categoryId = categoryResult.rows[0].id;
      // Récupérer du nom de la catégorie
      const categoryName = valuesCategory[0];

      // Valeurs à insérer dans la table de jointure "family_has_category"
      const regroupFamilyCategorieValue = [familyId, categoryId, categoryName];

      // Exécution de la requête pour insérer une nouvelle entrée dans la table de jointure "family_has_category"
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

  // Méthode pour mettre à jour une catégorie dans la base de données
  // les paramettre Id est tjr avant car nous utilisons l'ID pour identifier la catégorie que nous voulons mettre à jour
  async updateOneCategory(id, categoryName) {
    // Requête pour modifier une catégorie dans la table category
    const sqlQuery = `UPDATE category SET name = $1 WHERE id = $2;`;
    // Tableau des valeurs à insérer
    const values = [categoryName.name, id];
    console.log("values>>>>>>>>>>>", values);

    try {
      // Exécution de la requête SQL pour mettre à jour la catégorie de la BDD
      const result = await dbClient.query(sqlQuery, values);
      console.log("response>>>>>>>>>>>", result);
      return result;
    } catch (err) {
      throw new Error(`
    Erreur lors de la mise à jour de la catégorie ${err.message}`);
    }
  },

  // Méthode pour supprimer une catégorie dans la base de données
  async deleteOneCategory(id) {
    // la requête pour supprimer la catégorie de la table de jointure "family_has_category"
    const deleteFamilyHasCategoryQuery = `DELETE FROM family_has_category WHERE category_id=$1`;
    const categoryValuesId = [id];
    console.log("categoryValuesId>>>>>>>>>>>", categoryValuesId);

    try {
      // Car quand on essaye de supprimer la catégorie avant la jointure ça ne marche pas
      // il demande la contrainte de la FK
      // Supprimer les enregistrements correspondants dans la table de jointure
      await dbClient.query(deleteFamilyHasCategoryQuery, categoryValuesId);

      // la requête pour supprimer la catégorie dans la table "category"
      const sqlQueryCategory = `DELETE FROM category WHERE id=$1;`;
      const result = await dbClient.query(sqlQueryCategory, categoryValuesId);

      // Récupérer de l'ID de la catégorie supprimé
      const deletedCategory = result.rows[0];
      // console.log("result DataMapper>>>>>>>>>>>", deletedCategory);
      return deletedCategory;
    } catch (err) {
      throw new Error(
        `Erreur lors de la suppression de la catégorie: ${err.message}`
      );
    }
  },
};

module.exports = categoryModel;
