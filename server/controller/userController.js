const { userModel } = require("../models");
// module JWT pour les Token
const jwt = require("jsonwebtoken");

// Option refresh du token stocker
const refreshTokenExpiration = "7d";

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
    // récupere les données du formulaire (email et mot de passe)
    const { email, password } = req.body;

    // Les donnée du formulaire
    console.log("{ email, password }>>>>>>   ", { email, password });

    // generation du token grace a l'email d'identification et une durée de 30min pour le token
    // Le refresh du token dure 7jours pour éviter de demander a l'utilisateur de se connecter toutes les 30min
    var token = jwt.sign({ email }, process.env.SECRET, {
      expiresIn: "30m",
      expiresIn: refreshTokenExpiration,
    });

    console.log("TOKEN : >>>>>>", token);

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
        role_Id: user.role_id, // Récupérer l'id du rôle à partir de la clé étrangère dans la table utilisateur
      };

      // stock les info de la session dans formattedUser
      req.session.user = formattedUser;
      console.log("formattedUser>>>>>>>", formattedUser);

      // Si l'utilisateur existe et le mot de passe est correct on le connecte et on renvoi le token
      res.json({ message: "connexion", token });
      //res.redirect('/');
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "internal server error" });
    }
  },

  logout(req, res) {
    req.session.destroy();
    res.json({ message: "déconnexion" });
    // res.redirect('/');
  },

  show(req, res) {
    // Avoir les valeurs de l'objet du token depuis req.token
    const reqValeus = Object.values(req.token);
    // console.log("reqValeus>>>>>>>>", reqValeus)

    // Prendre la 1er valeur de l'objet envoyer = le mail de l'utilisateur
    const reqMailValue = reqValeus[0];
    // console.log("reqMailValue>>>>>>>>", reqMailValue)

    res.status(200).json({
      Message: "Vous etes bien authentifié avec l'email " + reqMailValue,
    });
  },
};

module.exports = userController;
