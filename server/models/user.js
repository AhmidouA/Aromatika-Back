const { dbClient } = require("../service");
const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");

const userModel = {
  // methode inserer un nouvelle utilisateur.
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
    const sqlQuery = `INSERT INTO "user" (username, mail, password, role_id) VALUES ($1, $2, $3, 1)`;
    const values = [username, mail, hash];

    try {
      const result = await dbClient.query(sqlQuery, values);
      // console.log("result>>>>>", result);
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
};

module.exports = userModel;
