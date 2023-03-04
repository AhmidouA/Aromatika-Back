const { userModel, oilModel } = require("../models");
// Module JWT pour les Token
const jwt = require("jsonwebtoken");
// Module multer pour la gestion des fichiers uploadés (image)
const multer = require("multer");

const userController = {
  // Module Home Page
  homePage(req, res) {
    res.json({ message: `Bienvenu sur Aromatokä` });
  },

  // Module signUp Page (get)
  indexSignupPage(req, res) {
    res.json({ message: `Inscription` });
  },

  // Module signUp page pour l'inscription (formulaire)
  async signup(req, res) {
    // recupere les donnée du body
    const formData = req.body;

    try {
      // Appel la bdd et insert les nouvelle donnée
      await userModel.insertUser(formData);
      // redirige vers la page une fois que tout est bon
      res.status(201).json({ message: `utilisateur crée` });
    } catch (err) {
      console.error(err);
      // si y'a une erreur dans le formulaire envoi une erreur
      res
        .status(500)
        .json({ message: `Le Pseudo ou l'email est déjà utilisé` });
    }
  },

  // Module Login Page (get)
  indexLoginPage(req, res) {
    res.json({ message: `connexion` });
  },

  // Module Login page pour la connexion (formulaire)
  async login(req, res) {
    // récupere les données du formulaire (email et mot de passe)
    const { email, password } = req.body;

    // Les donnée du formulaire
    console.log("{ email, password }>>>>>>   ", { email, password });

    // generation du token grace a l'email d'identification et une durée de 30min pour le token
    // Le refresh du token dure 7jours pour éviter de demander a l'utilisateur de se connecter toutes les 30min
    var token = jwt.sign({ email }, process.env.SECRET, {
      expiresIn: "30m",
    });

    console.log("TOKEN : >>>>>>", token);

    try {
      // Appel du datamapper pour récupérer l'utilisateur
      const user = await userModel.loginUser(email, password);

      // Si l'utilisateur n'existe pas ou le mot de passe est incorrect, afficher une erreur
      if (!user) {
        return res.status(500).json({ message: `utilisateur ou mot de passe incorrect` });
      }

      // stocke la session de l'utilisateur. Elle permet de garder la session active de l'utilisateur par rapport a son role
      const formattedUser = {
        id: user.id,
        name: user.username,
        createdAt: user.created_at,
        role_id: user.role_id, // Récupérer l'id du rôle à partir de la clé étrangère dans la table utilisateur
      };

      // stock les info de la session dans formattedUser
      req.session.user = formattedUser;
      console.log("formattedUser>>>>>>>", formattedUser);

      // Si l'utilisateur existe et le mot de passe est correct on le connecte et on renvoi le token
      res.json({ message: `connexion`, token });
      //res.redirect('/');
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: `Erreur serveur` });
    }
  },

  // Module profile
  async profile(req, res) {
    // Avoir les valeurs de l'objet du token depuis req.token
    const reqValeus = Object.values(req.token);
    // console.log("reqValeus>>>>>>>>", reqValeus)

    // La date de creation du compte (Demande du front pour afficher au profil)
    // générer grace a la session user dans login
    const created_at = req.session.user.createdAt;
    // console.log("createdAt>>>>>>>>", created_at)
    const userName = req.session.user.name;
    // console.log("userName>>>>>>>>", userName)
    const userId = req.session.user.id;

    // Récupérer les favoris de l'user
    const userFavorites = await userModel.findFavoritesByUserId(userId);
    // console.log("userFavorites>>>>>>>>", userFavorites)

    // Récupérer l'user
    const user = await userModel.getUserById(userId);
    // console.log("user>>>>>>>>", user)
    // Récupérer l'image de l'user a partir de l'user
    const picture = user.picture;

    // Prendre la 1er valeur de l'objet envoyer = le mail de l'utilisateur
    const reqMailValue = reqValeus[0];
    // console.log("reqMailValue>>>>>>>>", reqMailValue)

    res.status(200).json({
      Message: "Vous etes bien authentifié avec l'email " + reqMailValue,
      created_at: created_at,
      userName: userName,
      userFavorites: userFavorites,
      picture: picture,
    });
  },
  // Module pour ajouter les huile au favoris
  async addFavorite(req, res) {
    const { user_id, oil_id } = req.body;
    console.log("{ user_Id, oil_Id }>>>>>>>>", { user_id, oil_id });

    try {
      // Check si l'user est bien inscrit dans la bdd
      const user = await userModel.getUserById(user_id);
      console.log("{ user }>>>>>>>>", user);
      if (!user) {
        return res.status(500).json({ error: `Utilisateur non trouvé.` });
      }

      // Ajoute l'huile aux favoris de l'user
      const userFavorites = await userModel.addFavoritsUser(user_id, oil_id);
      console.log("{ favorite }>>>>>>>>", userFavorites);

      // // Vérifie si l'huile à ajouter est dans les favoris de l'utilisateur
      // si je mets se code l'user ne pourra pas remmetre l'huile dans ses favoris encore 1 fois
      // Aprés l'avoir delete 1 fois
      // if (userFavorites || userFavorites.length>0) {
      //   return res.status(400).json({Message: `L'huile n'est pas dans les favoris de l'utilisateur.`});
      // }

      res.status(200).json({ message: `Favori ajouté.`, userFavorites });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: `Erreur lors de l\'ajout du favori.` });
    }
  },

  // Module pour supprimer les huile des favoris
  async deleteFavorite(req, res) {
    const { user_id, oil_id } = req.body;
    // console.log("{ { user_Id, oil_Id } }>>>>>>>>", { user_id, oil_id });
    try {
      // Check si l'user est bien inscrit dans la bdd
      const user = await userModel.getUserById(user_id);
      console.log("{ user }>>>>>>>>", user);
      if (!user) {
        return res.status(500).json({ error: `Utilisateur non trouvé.` });
      }

      // Récupère les favoris de l'utilisateur
      const userFavorites = await userModel.findFavoritesByUserId(user_id);
      // console.log("userFavorites>>>>>>>>", userFavorites)

      // Vérifie si l'huile à supprimer est dans les favoris de l'utilisateur
      if (!userFavorites || userFavorites.length === 0) {
        return res
          .status(500)
          .json({
            Message: `L'huile n'est pas dans les favoris de l'utilisateur.`,
          });
      }
      // je récupére l'id de oil (oil_id) avant de la supprimer
      // hasOilInFavorites est un tableau d'objet
      // const hasOilInFavorites = userFavorites[0].oil_id;
      // console.log("hasOilInFavorites>>>>>>>>", hasOilInFavorites)

      // Recuépere de l'id de l'huile
      const oil = await oilModel.getOneOilById(oil_id);
      // console.log("oil>>>>>>>>", oil)
      // Check pour voir si l'huile existe bien
      if (!oil) {
        return res.status(500).json({ error: `Huile non trouvée.` });
      }

      // Supprime l'huile aux favoris de l'user
      const favorite = await userModel.deleteFavoritsUser(user_id, oil_id);
      console.log("{ favorite }>>>>>>>>", favorite);
      res.status(200).json({ message: "Favori supprimé.", favorite });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: `Erreur lors de la suppression du favori.` });
    }
  },

  // Module pour ajouter une photo au profile
  async addPicture(req, res) {
    const userId = req.params.id;
    // console.log("userId", userId);

    // récupere le chemin de l'image uploadée
    const picture = req.file.path;
    // console.log("picture", picture);

    try {
      // Appel de la méthode (datammaper)) d'user pour ajouter l'image à l'user
      const result = await userModel.addUserPicture(userId, picture);
      console.log("result", result);
      res
        .status(200)
        .json({ message: `L'image a bien été téléchargé.`, result });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: `Erreur lors du téléchargement de l'image` });
    }
  },

  // Module pour se deconnecter
  logout(req, res) {
    // supprimer la session enregistré et son token
    delete req.session.user;
    delete req.token;

    res.json({ message: "déconnexion" });
  },
};

module.exports = userController;
