const { userModel, oilModel } = require("../models");
// Module JWT pour les Token
const jwt = require("jsonwebtoken");
// logger des erreurs client
const logger = require("../service/logger");
// la seul qui marche avec require  "chalk": "^4.1.2",
const chalk = require("chalk");
const upload = require("../service/multer");
const fs = require("fs");

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
    console.log(chalk.bgBlue("{ formData.username }>>>>>>", formData.username));
    console.log(chalk.bgBlue("{ formData.mail }>>>>>>", formData.email));

    try {
      // Appel la bdd et insert les nouvelle donnée
      await userModel.insertUser(formData);
      res.status(201).json({ Message: "Bienvenu ", name: formData.username });
    } catch (err) {
      console.error(chalk.bgRedBright(err));
      res
        .status(500)
        .json({ message: `Le Pseudo ou l'email est déjà utilisé` });

      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: "Le Pseudo ou l'email est déjà utilisé",
      });
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
    console.log(chalk.bgBlue("{ email password }>>>>>>", email));

    try {
      // Appel du datamapper pour récupérer l'utilisateur
      const user = await userModel.loginUser(email, password);

      // Si l'utilisateur n'existe pas ou le mot de passe est incorrect, afficher une erreur
      if (!user) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: "utilisateur ou mot de passe incorrect",
        });
        return res
          .status(500)
          .json({ message: `utilisateur ou mot de passe incorrect` });
      }

      // stocke la session de l'utilisateur. Elle permet de garder la session active de l'utilisateur par rapport a son role
      const formattedUser = {
        id: user.id,
        name: user.username,
        createdAt: user.created_at,
        role_id: user.role_id, // Récupérer l'id du rôle à partir de la clé étrangère dans la table utilisateur
        // picture: user.picture,
      };

      // stock les info de la session dans formattedUser
      req.session.user = formattedUser;
      // console.log(chalk.bgGreen("{ formattedUser }>>>>>>", Object.values(formattedUser)))

      // generation du token grace a l'email d'identification et une durée de 120min pour le token
      // j'envoi aussi les info de la session grace au payload que j'envoi dans la session user

      const token = jwt.sign(
        { email, user: formattedUser },
        process.env.SECRET,
        {
          expiresIn: "120m",
        }
      );

      console.log(chalk.bgBlack("{ TOKEN }>>>>>>", token));

      // Si l'utilisateur existe et le mot de passe est correct on le connecte et on renvoi le token
      res.json({ name: formattedUser.name, token });
    } catch (err) {
      console.error(chalk.bgRedBright(err));
      res
        .status(500)
        .json({ message: "utilisateur non inscrit " + formattedUser });

      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: "utilisateur non isncrit " + formattedUser,
      });
    }
  },

  // Module pour ajouter une photo au profile
  async addPicture(req, res) {
    const userId = req.params.id;
    console.log(chalk.bgBlue("{ userId }>>>>>>", userId));

    // récupere le chemin de l'image uploadée
    const file = req.file.filename;
    console.log(chalk.bgCyan("{ picture }>>>>>>", file));

    try {

      const user = await userModel.addUserPicture(userId, file);
      console.log(chalk.bgGreen("{ user }>>>>>>", Object.values(user)));
      res.status(200).json({ message: `L'image a bien été téléchargé.`, file });
    } catch (error) {
      console.error(chalk.bgRedBright(error));
      res
        .status(500)
        .json({ error: `Erreur lors du téléchargement de l'image` });

      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: "Erreur lors du téléchargement de l'image",
      });
    }
  },
  // Module stream Image
  streamPicture(req, res) {
    const file = req.params.file;
    fs.createReadStream(`server/public/upload/${file}`).pipe(res);
  },

  // Module profile
  async profile(req, res) {
    // Avoir les valeurs de l'objet du token depuis req.token
    const reqValeus = Object.values(req.token);
    // console.log(chalk.bgCyan("{ reqValeus }>>>>>>", reqValeus[1].id));

    // La date de creation du compte (Demande du front pour afficher au profil)
    // générer grace a la session user dans login
    // Prendre la 1er valeur de l'objet envoyer = le mail de l'utilisateur
    const userMail = reqValeus[0];
    // console.log(chalk.bgCyan("userMail>>>>>>>>", userMail))
    const created_at = reqValeus[1].createdAt;
    // console.log(chalk.bgCyan("created_at>>>>>>>>", created_at))
    const userName = reqValeus[1].name;
    // console.log(chalk.bgCyan("userName>>>>>>>>", userName))
    const userId = reqValeus[1].id;
    // console.log(chalk.bgCyan("userId>>>>>>>>", userName))
    // const userImage = reqValeus[1].image;
    // console.log(chalk.bgCyan("userImage>>>>>>>>", userImage))

    // Récupérer les favoris de l'user
    const userFavorites = await userModel.findFavoritesByUserId(userId);
    // console.log(chalk.bgBlue("{ userFavorites }>>>>>>", userFavorites[0].oil_id));

    // Récupérer l'user (solution de secours)
    const user = await userModel.getUserById(userId);
    const userImage = user.image;
    // console.log(chalk.bgGreen("{ user }>>>>>>", Object.values((user))))
    // console.log(chalk.bgCyan("userImage>>>>>>>>", userImage))

    res.status(200).json({
      Message: "Vous etes bien authentifié avec l'email ",
      userMail: userMail,
      created_at: created_at,
      userName: userName,
      userFavorites: userFavorites,
      userImage: userImage,
      userId: userId
    });
  },
  // Module pour ajouter les huile au favoris
  async addFavorite(req, res) {
    const { user_id, oil_id } = req.body;
    console.log(chalk.bgGreen("{ formattedUser }>>>>>>","user_id " + Object.values(user_id)));
    console.log(chalk.bgGreen("{ formattedUser }>>>>>>","oil_id " + Object.values(oil_id)));

    try {
      // recupére l'user
      const user = await userModel.getUserById(user_id);
      console.log(chalk.bgBlue("{ user }>>>>>>", user.mail));

      // check si c'est bien i'id est bien celui veut add
      if (parseInt(user_id) !== user.id) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: "Utilisateur non trouvé " + user.mail,
        });
        return res.status(500).json({ error: `Utilisateur non trouvé` + user });
      }

      // Recuépere de l'id de l'huile
      const oil = await oilModel.getOneOilById(oil_id);
      console.log(chalk.bgYellow("{ oil_id }>>>>>>", +oil_id));
      // Check pour voir si l'huile existe bien
      if (!oil) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: "Huile non trouvée.` " + oil,
        });
        return res.status(500).json({ error: `Huile non trouvée.` });
      }

      // Regarde les favoris de l'user dans la fonction findByuser du models
      const userFavorites = await userModel.findFavoritesByUserId(user_id);
      console.log(chalk.bgWhite("{ userFavorites }>>>>>>", userFavorites.length));
      console.log(chalk.bgWhite("{ userFavorites }>>>>>>", userFavorites.oil_id));

      // Vérifie si l'huile à ajouté est déja dans les favoris de l'utilisateur
      if (oil_id in userFavorites) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message:
            "L'huile est dans les favoris de l'utilisateur " + user.username,
        });
        return res
          .status(500)
          .json({
            Message:
              "L'huile est dans les favoris de l'utilisateur " + user.username,
          });
      }

      // Ajoute l'huile aux favoris de l'user
      const updatedFavorites = await userModel.addFavoritsUser(user_id, oil_id);
      console.log(chalk.bgBlue("{ updatedFavorites }>>>>>>", updatedFavorites));

      res
        .status(200)
        .json({ message: `Favori ajouté.`, updatedFavorites });
    } catch (err) {
      console.error(chalk.bgRedBright(err));
      res.status(500).json({ error: "Erreur lors de l'ajout du favori" });

      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message:
          "Erreur lors de l'ajout du favori de l'user_id " +
          user_id +
          " et de l'huile_id " +
          oil_id,
      });
    }
  },

  // Module pour supprimer les huile des favoris
  async deleteFavorite(req, res) {
    const { user_id, oil_id } = req.body;
    console.log(
      chalk.bgBlue("{ formattedUser }>>>>>>","user_id " + Object.values(user_id)));
    console.log(
      chalk.bgBlue("{ formattedUser }>>>>>>", "oil_id " + Object.values(oil_id)));

    try {
      // recupére l'user
      const user = await userModel.getUserById(user_id);
      console.log(chalk.bgGreen("{ user }>>>>>>", user));
      // console.log(chalk.bgYellow("{ user_id }>>>>>>", user_id));
      // console.log(chalk.bgYellow("{ user.id }>>>>>>", user.id));

      // Check si l'user est bien inscrit dans la bdd
      if (parseInt(user_id) !== user.id) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: "Utilisateur non trouvé. " + user.username,
        });
      }

      // Recuépere de l'id de l'huile
      const oil = await oilModel.getOneOilById(oil_id);
      console.log(chalk.bgYellow("{ oil_id }>>>>>>", +oil_id));
      // Check pour voir si l'huile existe bien
      if (!oil) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: "Huile non trouvée.` " + oil,
        });
        return res.status(500).json({ error: `Huile non trouvée.` });
      }

      // Récupère les favoris de l'utilisateur
      const userFavorites = await userModel.findFavoritesByUserId(user_id);
      // console.log(chalk.bgBlue("{ userFavorites }>>>>>>", Object.values(userFavorites)));
      console.log(chalk.bgBlue("{ userFavorites }>>>>>>", userFavorites.oil_id));

      // verifie si je posséde au moins une huile dans les fav
      if (userFavorites.length === 0) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message:
            "L'huile n'est pas dans les favoris de " + user.username,
        });
        return res
          .status(500)
          .json({
            Message:
            "L'huile n'est pas dans les favoris de " + user.username,
          });
      }

      // Supprime l'huile aux favoris de l'user
      const favorite = await userModel.deleteFavoritsUser(user_id, oil_id);
      console.log(chalk.bgBlue("{ huile favorite id }>>>>>>", oil_id));

      res.status(200).json({ message: "Favori supprimé.", favorite });
    } catch (err) {
      console.error(chalk.bgRedBright(err));
      res
        .status(500)
        .json({ error: `Erreur lors de la suppression du favori` });

      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: "Erreur lors de la suppression du favori",
      });
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
