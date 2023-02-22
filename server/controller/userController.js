const { userModel } = require("../models");

const userController = {
  index(req, res) {
    res.render("signup");
  },
  async signup(req, res) {
    // recupere les donnée du body
    const formData = req.body;

    try {
      // Appel la bdd et insert les nouvelle donnée
      await userModel.insertUser(formData);
      // redirige vers la page une fois que tout est bon
      res.status(201).redirect("signup");
    } catch (err) {
      console.error(err);
      // si y'a une erreur dans le formulaire envoi une erreur
      res.status(400).render("400");
    }
  },
};

module.exports = userController;
