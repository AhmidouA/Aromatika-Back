const { dbClient } = require("../service");

const categoryModel = {
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
      throw new Error("Erreur lors de la récupération des catégories");
    }
  },

  async GetOneCategory(id) {
    // Requête pour récupérer une catégorie dans la table category
    const sqlCheckQuery = `SELECT * FROM category WHERE id = $1;`;
    console.log("sqlCheckQuery>>>>>>>>>>>", sqlCheckQuery);
    const values = [id];
    console.log("id>>>>>>>>>>>", id);

    try {
      const result = await dbClient.query(sqlCheckQuery, values);
      console.log("result>>>>>>>>>>>", result);
      return result.rows[0];
    } catch (err) {
      throw new Error("Erreur lors de la récupération de la catégorie");
    }
  },

  async insertCategory(category, family) {
    // Requête pour insérer une nouvelle catégorie dans la table category
    const sqlQueryCategory = `INSERT INTO category (name) VALUES ($1) RETURNING id`;
    // Requête  pour insérer une nouvelle catégorie dans la table family_has_category,
    // qui relie la famille passée à la nouvelle catégorie créée
    const sqlQueryFamily = `INSERT INTO family_has_category (family_id, category_id, name) VALUES ($1, $2, $3)`;

    // valeur pour la catégorie (Not Null) est le nom
    const valuesCategory = [category.name];
    console.log("valuesCategory>>>>>>>>>>>", valuesCategory);

    try {
      // On insérer la catégorie de la première requête
      const categoryResult = await dbClient.query(
        sqlQueryCategory,
        valuesCategory
      );
      // On récupère l'identifiant de la catégorie créée
      const categoryId = categoryResult.rows[0].id;

      // variable qui regoupe les valeur la family (family_id), categoryId (id de la catégorie)de valuesCategory (catégorie.name)
      const regroupFamilyCategorie = [family, categoryId, valuesCategory];

      // On exécute la deuxième requête pour lier la famille à la catégorie créée (table de la jointure)
      const familyResult = await dbClient.query(
        sqlQueryFamily,
        regroupFamilyCategorie
      );

      return familyResult;
    } catch (err) {
      throw new Error(
        `Erreur lors de la création de la catégorie ${err.message}`
      );
    }
  },

  async getOneCategories(req, res) {
    const id = req.params.id;
    console.log("id>>>>>>", id);

    try {
      const category = await categoryModel.GetOneCategories(id);
      console.log("category>>>>>>", category);
      res.status(200).json(category);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
  async addCategory(req, res) {
    const formData = req.body;
    console.log("formData>>>>>>", formData);

    try {
      const categoryId = await categoryModel.insertCategory(formData);
      console.log("categoryId>>>>>>", categoryId);
      res.status(200).json({ message: "Catégorie créée", categoryId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
};

module.exports = categoryModel;
