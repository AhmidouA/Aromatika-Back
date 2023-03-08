const { userModel, oilModel } = require("../models");
// Module JWT pour les Token
const jwt = require("jsonwebtoken");
// Module multer pour la gestion des fichiers uploadés (image)
const multer = require("multer");
// logger des erreurs client
const logger = require('../service/logger')
// la seul qui marche avec require  "chalk": "^4.1.2",
const chalk = require('chalk');

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
    console.log(chalk.bgBlue("{ formData.username }>>>>>>", formData.username))
    console.log(chalk.bgBlue("{ formData.mail }>>>>>>", formData.email))

    try {
      // Appel la bdd et insert les nouvelle donnée
      await userModel.insertUser(formData);
      res.status(201).json({Message: 'Bienvenu ', 
      name: formData.username });

    } catch (err) {
      console.error(chalk.bgRedBright(err));
      res.status(500).json({ message: `Le Pseudo ou l'email est déjà utilisé` });

      logger.customerLogger.log('error', { 
        url: req.url, 
        method: req.method, 
        message: 'Le Pseudo ou l\'email est déjà utilisé'
      })
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
    console.log(chalk.bgBlue("{ email password }>>>>>>", email))
    

    // generation du token grace a l'email d'identification et une durée de 30min pour le token
    // Le refresh du token dure 7jours pour éviter de demander a l'utilisateur de se connecter toutes les 30min
    var token = jwt.sign({ email }, process.env.SECRET, {
      expiresIn: "120m",
    });

    console.log(chalk.bgBlack("{ TOKEN }>>>>>>", token))

    try {
      // Appel du datamapper pour récupérer l'utilisateur
      const user = await userModel.loginUser(email, password);

      // Si l'utilisateur n'existe pas ou le mot de passe est incorrect, afficher une erreur
      if (!user) {
        logger.customerLogger.log('error', { 
          url: req.url, 
          method: req.method, 
          message: "utilisateur ou mot de passe incorrect"
        })
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
      // console.log(chalk.bgGreen("{ formattedUser }>>>>>>", Object.values(formattedUser)))

      // Si l'utilisateur existe et le mot de passe est correct on le connecte et on renvoi le token
      res.json({name: formattedUser.name ,token });
    } catch (err) {
      console.error(chalk.bgRedBright(err));
      res.status(500).json({ message: 'utilisateur non inscrit ' + formattedUser });

      logger.customerLogger.log('error', { 
        url: req.url, 
        method: req.method,
        message: 'utilisateur non isncrit ' + formattedUser
      })
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
    // console.log(chalk.bgBlue("{ userFavorites }>>>>>>", userFavorites))

    // Récupérer l'user
    const user = await userModel.getUserById(userId);
    console.log(chalk.bgGreen("{ user }>>>>>>", user.username))
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
    console.log(chalk.bgGreen("{ formattedUser }>>>>>>", 'user_id ' + Object.values(user_id)))
    console.log(chalk.bgGreen("{ formattedUser }>>>>>>", 'oil_id ' + Object.values(oil_id)))

    try {
      // Check si l'user est bien inscrit dans la bdd
      const user = await userModel.getUserById(user_id);
      console.log(chalk.bgBlue("{ user }>>>>>>", user.mail))

      if (!user) {
        logger.customerLogger.log('error', { 
          url: req.url, 
          method: req.method, 
          message: 'Utilisateur non trouvé ' + user
        })
        return res.status(500).json({ error: `Utilisateur non trouvé` });
      }
      
      // Ajoute l'huile aux favoris de l'user
      const updatedFavorites = await userModel.addFavoritsUser(user_id, oil_id);
      console.log(chalk.bgBlue("{ userFavorites }>>>>>>", updatedFavorites))

      res.status(200).json({ message: `Favori ajouté.`, updatedFavorites });

    } catch (err) {
      console.error(chalk.bgRedBright(err));
      res.status(500).json({ error: 'Erreur lors de l\'ajout du favori' });

      logger.customerLogger.log('error', { 
        url: req.url, 
        method: req.method, 
        message: 'Erreur lors de l\'ajout du favori de l\'user_id ' + user_id + 
                 ' et de l\'huile_id ' + oil_id
      })
    }
  },

  // Module pour supprimer les huile des favoris
  async deleteFavorite(req, res) {
    const { user_id, oil_id } = req.body;
    console.log(chalk.bgBlue("{ formattedUser }>>>>>>", 'user_id ' + Object.values(user_id)))
    console.log(chalk.bgBlue("{ formattedUser }>>>>>>", 'oil_id ' + Object.values(oil_id)))
    try {
      // Check si l'user est bien inscrit dans la bdd
      const user = await userModel.getUserById(user_id);
      console.log(chalk.bgGreen("{ user }>>>>>>", user.mail));
      // console.log(chalk.bgYellow("{ user_id }>>>>>>", user_id));
      // console.log(chalk.bgYellow("{ user.id }>>>>>>", user.id));
      if (parseInt(user_id) !== user.id ) {
        logger.customerLogger.log('error', { 
          url: req.url, 
          method: req.method, 
          message: 'Utilisateur non trouvé. ' + user.mail
        });
        return res.status(500).json({ error: `'L\'ID de l\'utilisateur dans la requête ne correspond pas à l\'ID de l\'utilisateur extrait du token. ' + user.mail` });
      }

      // Récupère les favoris de l'utilisateur
      const userFavorites = await userModel.findFavoritesByUserId(user_id);
      // console.log(chalk.bgBlue("{ userFavorites }>>>>>>", Object.values(userFavorites)));

      // Vérifie si l'huile à supprimer est dans les favoris de l'utilisateur
      if (userFavorites.length === 0) {
        logger.customerLogger.log('error', { 
          url: req.url, 
          method: req.method, 
          message: 'L\'huile n\'est pas dans les favoris de l\'utilisateur ' + user.mail
        })
        return res.status(500).json({Message: 'L\'huile n\'est pas dans les favoris de l\'utilisateur '});
      }

      // Recuépere de l'id de l'huile
      const oil = await oilModel.getOneOilById(oil_id);
      console.log(chalk.bgYellow("{ oil_id }>>>>>>", + oil_id));
      // Check pour voir si l'huile existe bien
      if (!oil) {
        logger.customerLogger.log('error', { 
          url: req.url, 
          method: req.method, 
          message: 'Huile non trouvée.` ' + oil
        })
        return res.status(500).json({ error: `Huile non trouvée.` });
      }

      // Supprime l'huile aux favoris de l'user
      const favorite = await userModel.deleteFavoritsUser(user_id, oil_id);
      console.log(chalk.bgBlue("{ huile favorite id }>>>>>>", oil_id));

      res.status(200).json({ message: "Favori supprimé.", favorite });

    } catch (err) {
      console.error(chalk.bgRedBright(err));
      res.status(500).json({ error: `Erreur lors de la suppression du favori` });

      logger.customerLogger.log('error', { 
        url: req.url, 
        method: req.method, 
        message: 'Erreur lors de la suppression du favori'
      })
    }
  },

  // Module pour ajouter une photo au profile
  async addPicture(req, res) {
    const userId = req.params.id;
    console.log(chalk.bgBlue("{ userId }>>>>>>", userId));

    // récupere le chemin de l'image uploadée
    const picture = req.file.path;
    // console.log("picture", picture);

    try {
      // Appel de la méthode (datammaper)) d'user pour ajouter l'image à l'user
      const result = await userModel.addUserPicture(userId, picture);
      console.log(chalk.bgGreen("{ result }>>>>>>", result));

      res.status(200).json({ message: `L'image a bien été téléchargé.`, result });

    } catch (error) {
      console.error(chalk.bgRedBright(err));
      res.status(500).json({ error: `Erreur lors du téléchargement de l'image` });

      logger.customerLogger.log('error', { 
        url: req.url, 
        method: req.method, 
        message: 'Erreur lors du téléchargement de l\'image'
      })
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
