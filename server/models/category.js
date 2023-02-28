const { dbClient } = require("../service");


const categoryModel = {

    async GetCategories (familyName) {
        // console.log("familyName>>>>>>>>>>>", familyName)

         // On définit la requête qui va récupérer les catégories de la famille demandée
        const sqlCheckQuery = ` SELECT category.id, category.name 
        FROM category 
        JOIN family_has_category ON category.id = family_has_category.category_id 
        JOIN family ON family_has_category.family_id = family.id 
        WHERE family.name = $1;`;

        
        const values = [familyName]
        // console.log("values>>>>>>>>>>>", values)

        try {

            // On exécute la requête SQL avec les valeurs définies
            const result = await dbClient.query(sqlCheckQuery, values)
            // console.log("result>>>>>>>>>>>", result)

            // On retourne les catégories récupérées sous forme de tableau d'objets rows
            return result.rows;
        } catch (err) {
            throw new Error ("Erreur lors de la récupération des catégories")
        }
    },

    async GetOneCategories (id) {
        const sqlCheckQuery = `SELECT * FROM category WHERE id = $1;`;
        console.log("sqlCheckQuery>>>>>>>>>>>", sqlCheckQuery)
        const values = [id]
        console.log("id>>>>>>>>>>>", id)

        try {
            const result = await dbClient.query(sqlCheckQuery, values)
            console.log("result>>>>>>>>>>>", result)
            return result.rows[0]
        } catch (err) {
            throw new Error ("Erreur lors de la récupération de la catégorie")
        }
    }, 

    async insertCategory (category, family) {

        // inserer dans la table catégorie 
        const sqlQueryCategory = `INSERT INTO category (name) VALUES ($1) RETURNING id;`;
         // inserer dans la table family_has_category (table de jointure) 
        const sqlQueryFamily = `INSERT INTO family_has_category (family_id, category_id) VALUES (1, $2);`;

        console.log("sqlQueryCategory>>>>>>>>>>>", sqlQueryCategory)
        console.log("sqlQueryFamily>>>>>>>>>>>", sqlQueryFamily)

        try {
            const result = await dbClient.query(sqlQueryCategory, [category] )
            console.log("result>>>>>>>>>>>", result)

            const categoryId = result.rows[0].id;
            console.log("categoryId>>>>>>>>>>>", categoryId)

            const sqlResult = await dbClient.query(sqlQueryFamily, [family, categoryId])
            console.log("sqlResult>>>>>>>>>>>", sqlResult)
            return sqlResult

        } catch (err) {
            console.error("Erreur lors de l'insertion de la catégorie : ", err);
            throw new Error("Erreur lors de la création de la catégorie");
        }
    }
}

module.exports = categoryModel;