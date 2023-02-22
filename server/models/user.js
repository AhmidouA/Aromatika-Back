const { dbClient } = require("../service");
const emailValidator = require("email-validator");
const bcryptjs = require('bcryptjs');

const userModel = {
  async insertUser(formData) {

    // récupérer les data du formulaire
    const pseudo = formData.pseudo;
    const email = formData.email;
    const password = formData.password;
    const passwordConfirm = formData.passwordConfirm;

    // Vérifier si le pseudo et l'email n'existent pas déjà dans la base de données
    const sqlCheckQuery = `SELECT * FROM "user" WHERE pseudo=$1 OR email=$2`;
    const checkValues = [pseudo, email];
    const resultCheck = await dbClient.query(sqlCheckQuery, checkValues);

    // Vérifier si le pseudo ou email dans la bdd
    if (resultCheck.rowCount > 0) {
      throw new Error("Le pseudo ou l'email est déjà utilisé.");
    }

    try {
      // Vérifier le format de email grace a emailValidator
      if (!emailValidator.validate(email)) {
        throw new Error("Email invalide");
      }

      // Vérifier entre le mot de passe et la confirmation du mot de passe
      if (password !== passwordConfirm) {
        throw new Error("le mot de passe ne correspond pas");
      }
    } catch (err) {
      throw err;
    }

    // le hash du mot de passe
    const hash = await bcryptjs.hash(password, 10)

    // Insérer l'utilisateur si le pseudo et l'email n'existent pas déjà
    const sqlQuery = `INSERT INTO "user" (pseudo, email, password) VALUES ($1, $2, $3)`;
    const values = [pseudo, email, hash];

    try {
      const result = await dbClient.query(sqlQuery, values);
      console.log("result>>>>>", result);
    } catch (err) {
      console.error(err);
    }
  },
};

module.exports = userModel;
