const { dbClient } = require("../service");
const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");

const userModel = {
  async insertUser(formData) {
    const username = formData.username;
    const mail = formData.email;
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    const sqlCheckQuery = `SELECT * FROM "user" WHERE username=$1 OR mail=$2`;
    const checkValues = [username, mail];
    const resultCheck = await dbClient.query(sqlCheckQuery, checkValues);

    if (resultCheck.rowCount > 0) {
      throw new Error("Le username ou l'email est déjà utilisé.");
    }

    try {
      if (!emailValidator.validate(mail)) {
        throw new Error("Email invalide");
      }

      if (password !== confirmPassword) {
        throw new Error("le mot de passe ne correspond pas");
      }
    } catch (err) {
      throw err;
    }

    const hash = await bcrypt.hash(password, 10);

    const sqlQuery = `INSERT INTO "user" (username, mail, password, role_id) VALUES ($1, $2, $3, 2)`;
    const values = [username, mail, hash];

    try {
      const result = await dbClient.query(sqlQuery, values);
      console.log("result>>>>>", result);
    } catch (err) {
      console.error(err);
    }
  },

  async loginUser(userMail, password) {
    const sqlQuery = `SELECT * FROM "user" WHERE mail=$1`;
    const values = [userMail];
    console.log("sqlQuery", sqlQuery);
    console.log("values>>>>>>>>>>", values);

    try {
      const result = await dbClient.query(sqlQuery, values);
      const user = result.rows[0];
      console.log("user>>>>>>>>", user);

      if (!user) {
        throw new Error("Utilisateur est incorrect");
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        return user;
      } else {
        throw new Error("Le mot de passe est incorrect.");
      }
    } catch (err) {
      console.error(err);

      return null;
    }
  },

  async getUserById(userId) {
    const sqlQuery = 'SELECT * FROM "user" WHERE id = $1;';
    const values = [userId];

    try {
      const result = await dbClient.query(sqlQuery, values);

      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw new Error("Erreur lors de la récupération de l'utilisateur.");
    }
  },

  async getUserByMail(userMail) {
    const sqlQuery = `SELECT * FROM "user" WHERE mail = $1;`;
    const values = [userMail];

    console.log("sqlQuery", sqlQuery);
    console.log("values", values);

    try {
      const result = await dbClient.query(sqlQuery, values);
      console.log("result>>>>>>>>>>", result.rows[0]);
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw new Error("Erreur lors de la récupération de l'utilisateur.");
    }
  },

  async getUserByUsername(username) {
    const sqlQuery = 'SELECT * FROM "user" WHERE username = $1;';
    const values = [username];
    console.log("sqlQuery getUserByUsername>>>>>>>", sqlQuery);
    console.log("values getUserByUsername>>>>>>>>>>", values);

    try {
      const result = await dbClient.query(sqlQuery, values);
      console.log("result getUserByUsername>>>>>>>>>>", result.rows[0]);
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw new Error(
        "Erreur lors de la récupération de l'utilisateur par son Pseudo."
      );
    }
  },

  async updateUsername(userId, username) {
    const sqlQuery = `UPDATE "user" SET username=$1 WHERE id=$2;`;
    const values = [username, userId];
    console.log("sqlQuery updateUsername>>>>>>>", sqlQuery);
    console.log("values updateUsername>>>>>>>>>>", values);

    try {
      const result = await dbClient.query(sqlQuery, values);
      console.log("result updateUsername>>>>>>>>>>", result);
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw new Error(
        "Erreur lors de la modification du Pseudo de l'utilisateur."
      );
    }
  },

  async updateUserPassword(userId, password) {
    const sqlQuery = `UPDATE "user" SET password=$1 WHERE id=$2;`;
    const values = [password, userId];

    try {
      const result = await dbClient.query(sqlQuery, values);

      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw new Error(
        "Erreur lors de la modification du mot de passe de l'utilisateur."
      );
    }
  },

  async findFavoritesByUserId(id) {
    const sqlQuery =
      "SELECT * FROM oil_has_user WHERE user_id = $1 AND favorite = true;";
    const values = [id];

    try {
      const result = await dbClient.query(sqlQuery, values);

      return result.rows;
    } catch (error) {
      console.error(error);
      throw new Error("introvable.");
    }
  },

  async addFavoritsUser(userId, oilId) {
    const sqlQuery =
      "INSERT INTO oil_has_user(user_id, oil_id, favorite) VALUES($1, $2, $3) RETURNING *;";
    const values = [userId, oilId, true];

    try {
      const result = await dbClient.query(sqlQuery, values);
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw new Error("Erreur lors de l'ajout du favori.");
    }
  },

  async deleteFavoritsUser(userId, oilId) {
    const sqlQuery =
      "DELETE FROM oil_has_user WHERE user_id = $1 AND oil_id = $2 AND favorite = true RETURNING *;";
    const values = [userId, oilId];

    try {
      const result = await dbClient.query(sqlQuery, values);

      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw new Error("Erreur lors de la suppression du favori.");
    }
  },

  async findAromathequeByUserId(id) {
    const sqlQuery =
      "SELECT * FROM oil_has_user WHERE user_id = $1 AND aromatheque = true;";
    const values = [id];

    try {
      const result = await dbClient.query(sqlQuery, values);

      return result.rows;
    } catch (error) {
      console.error(error);
      throw new Error("introvable.");
    }
  },

  async addAromathequeUser(userId, oilId) {
    const sqlQuery =
      "INSERT INTO oil_has_user(user_id, oil_id, aromatheque) VALUES($1, $2, $3) RETURNING *;";
    const values = [userId, oilId, true];

    try {
      const result = await dbClient.query(sqlQuery, values);
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw new Error("Erreur lors de l'ajout du favori.");
    }
  },

  async deleteAromathequeUser(userId, oilId) {
    const sqlQuery =
      "DELETE FROM oil_has_user WHERE user_id = $1 AND oil_id = $2 AND aromatheque = true RETURNING *;";
    const values = [userId, oilId];

    try {
      const result = await dbClient.query(sqlQuery, values);

      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw new Error("Erreur lors de la suppression du favori.");
    }
  },

  async addUserPicture(userId, image) {
    const sqlQuery = `UPDATE "user" SET image = $1 WHERE id = $2 RETURNING id, image`;
    const values = [image, userId];
    console.log("sqlQuery", sqlQuery);
    console.log("values", values);
    try {
      const result = await dbClient.query(sqlQuery, values);
      console.log("result", result);
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw new Error("Erreur lors de l'importation de l'image.");
    }
  },
};

module.exports = userModel;
