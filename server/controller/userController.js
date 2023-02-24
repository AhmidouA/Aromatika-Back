const { userModel } = require("../models");
// const jwt = require('jsonwebtoken');

const userController = {
  indexSignupPage(req, res) {
    res.json({ message: "Inscription" });
  },
  async signup(req, res) {
    // recupere les donnée du body
    const formData = req.body;

    try {
      // Appel la bdd et insert les nouvelle donnée
      await userModel.insertUser(formData);
      // redirige vers la page une fois que tout est bon
      res.status(201).json({ message: "utilisateur crée" });
    } catch (err) {
      console.error(err);
      // si y'a une erreur dans le formulaire envoi une erreur
      res.status(400).json({ message: "Mauvaise info" });
    }
  },

  indexLoginPage(req, res) {
    res.json({ message: "connexion" });
  },

  async login(req, res) {
    const { email, password } = req.body;

    // generation du token (Code a terminer)
    // var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
    // console.log("TOKEN : >>>>>>",token);

    try {
      // Appel du datamapper pour récupérer l'utilisateur
      const user = await userModel.loginUser(email, password);

      // Si l'utilisateur n'existe pas ou le mot de passe est incorrect, afficher une erreur
      if (!user) {
        return res.status(401).json({ message: "Non autorisé" });
      }

      // stocke la session de l'utilisateur. Elle permet de garder la session active de l'utilisateur par rapport a son role
      const formattedUser = {
        id: user.id,
        name: user.username,
        role: {
          name: user.role_name  // Récupérer l'id du rôle à partir de la clé étrangère dans la table utilisateur
        }
      };
      
    
    req.session.user = formattedUser;
    console.log("formattedUser>>>>>>>", formattedUser)
    


      // Si l'utilisateur existe et le mot de passe est correct, rediriger vers la page d'accueil
      res.json({ message: "connexion" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "internal server error" });
    }
  },

  logout(req, res) {
    req.session.destroy();
    res.json({ message: "déconnexion" });
  },
};

module.exports = userController;
