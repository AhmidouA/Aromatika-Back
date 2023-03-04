const { dbClient } = require("../service");
const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");

const userModel = {
  // methode inserer un nouvelle user.
  async insertUser(formData) {
    // récupérer les data du formulaire
    const username = formData.username;
    const mail = formData.email;
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    // Vérifier si le username et l'email n'existent pas déjà dans la base de données
    const sqlCheckQuery = `SELECT * FROM "user" WHERE username=$1 OR mail=$2`;
    const checkValues = [username, mail];
    const resultCheck = await dbClient.query(sqlCheckQuery, checkValues);

    // Vérifier si le pseudo ou email dans la bdd
    if (resultCheck.rowCount > 0) {
      throw new Error("Le username ou l'email est déjà utilisé.");
    }

    try {
      // Vérifier le format de email grace a emailValidator
      if (!emailValidator.validate(mail)) {
        throw new Error("Email invalide");
      }

      // Vérifier entre le mot de passe et la confirmation du mot de passe
      if (password !== confirmPassword) {
        throw new Error("le mot de passe ne correspond pas");
      }
    } catch (err) {
      throw err;
    }

    // le hash du mot de passe
    const hash = await bcrypt.hash(password, 10);

    // Insérer l'utilisateur si le pseudo et l'email n'existent pas déjà
    const sqlQuery = `INSERT INTO "user" (username, mail, password, role_id) VALUES ($1, $2, $3, 2)`;
    const values = [username, mail, hash];

    try {
      const result = await dbClient.query(sqlQuery, values);
      console.log("result>>>>>", result);
    } catch (err) {
      console.error(err);
    }
  },

  // methode se connecter
  async loginUser(mail, password) {
    const sqlQuery = `SELECT * FROM "user" WHERE mail=$1`;
    const values = [mail];
    // console.log("sqlQuery", sqlQuery)
    // console.log("values>>>>>>>>>>", values)

    try {
      const result = await dbClient.query(sqlQuery, values);
      const user = result.rows[0];
      console.log("user>>>>>>>>", user);

      // Vérifier si l'utilisateur existe
      if (!user) {
        throw new Error("Utilisateur est incorrect");
      }

      // Vérifier si le mot de passe est correct
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        // Retourner l'utilisateur
        return user;
      } else {
        throw new Error("Le mot de passe est incorrect.");
      }
    } catch (err) {
      console.error(err);
      // Retourner l'utilisateur
      return null;
    }
  },

  // methode trouver les favoris d'un user.
  async findFavoritesByUserId(id) {
    const sqlQuery =
      "SELECT * FROM oil_has_user WHERE user_id = $1 AND favorite = true;";
    const values = [id];
    // console.log("sqlQuery", sqlQuery);
    // console.log("values>>>>>>>>>>", values);
    try {
      const result = await dbClient.query(sqlQuery, values);
      // console.log("result DataMapper>>>>>>>>>>", result);
      return result.rows;
    } catch (error) {
      console.error(error);
      throw new Error("introvable.");
    }
  },

  // methode ajouter des huile aux favoris d'un user.
  async addFavoritsUser(userId, oilId) {
    const sqlQuery =
      "INSERT INTO oil_has_user(user_id, oil_id, favorite) VALUES($1, $2, $3) RETURNING *;";
    const values = [userId, oilId, true];
    // console.log("sqlQuery", sqlQuery);
    // console.log("values>>>>>>>>>>", values);
    try {
      const result = await dbClient.query(sqlQuery, values);
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw new Error("Erreur lors de l'ajout du favori.");
    }
  },

  // methode supprimer des huile aux favoris d'un user.
  async deleteFavoritsUser(userId, oilId) {
    const sqlQuery =
      "DELETE FROM oil_has_user WHERE user_id = $1 AND oil_id = $2 AND favorite = true RETURNING *;";
    const values = [userId, oilId];
    // console.log("sqlQuery", sqlQuery);
    // console.log("values>>>>>>>>>>", values);
    try {
      const result = await dbClient.query(sqlQuery, values);
      // console.log("result>>>>>>>>>>", result)
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw new Error("Erreur lors de la suppression du favori.");
    }
  },

  async addUserPicture(userId, picture) {
    const sqlQuery = `UPDATE "user" SET picture = $1 WHERE id = $2 RETURNING id, picture`;
    const values = [picture, userId];

    // console.log("sqlQuery", sqlQuery);
    // console.log("values", values);

    try {
      const result = await dbClient.query(sqlQuery, values);
      // console.log("result", result);
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw new Error("Erreur lors de l'importation de l'image.");
    }
  },
  // methode récuperer un user
  async getUserById(userId) {
    const sqlQuery = 'SELECT * FROM "user" WHERE id = $1;;';
    const values = [userId];
    // console.log("sqlQuery", sqlQuery);
    // console.log("values>>>>>>>>>>", values);

    try {
      const result = await dbClient.query(sqlQuery, values);
      // console.log("result>>>>>>>>>>", result)
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw new Error("Erreur lors de la récupération de l'utilisateur.");
    }
  },
};

module.exports = userModel;
