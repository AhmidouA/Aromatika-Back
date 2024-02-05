const { userModel, oilModel } = require("../models");
const jwt = require("jsonwebtoken");
const logger = require("../service/logger");
const bcrypt = require("bcrypt");
const chalk = require("chalk");
const fs = require("fs");
const { mail } = require("../service");
const { json } = require("express");

const userController = {
  homePage(req, res) {
    res.json({ message: `Bienvenu sur Aromatokä` });
  },

  indexSignupPage(req, res) {
    res.json({ message: `Inscription` });
  },
  async signup(req, res) {
    const formData = req.body;
    console.log(chalk.bgBlue("{ formData.username }>>>>>>", formData.username));
    console.log(chalk.bgBlue("{ formData.mail }>>>>>>", formData.email));
    console.log(chalk.bgBlue("{ formData.mail }>>>>>>", formData.password));
    console.log(
      chalk.bgBlue("{ formData.mail }>>>>>>", formData.confirmPassword)
    );

    try {
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
        message: `Le Pseudo ou l'email est déjà utilisé`,
      });
    }
  },

  indexLoginPage(req, res) {
    res.json({ message: `connexion` });
  },

  async login(req, res) {
    const { email, password } = req.body;
    console.log(chalk.bgBlue("{ email }>>>>>>", email));
    console.log(chalk.bgBlue("{ password }>>>>>>", password));

    let formattedUser = null;

    try {
      const user = await userModel.loginUser(email, password);
      console.log(chalk.bgGreen("{ user }>>>>>>", Object.values(user)));

      if (!user) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `utilisateur ou mot de passe incorrect`,
        });
        return res
          .status(500)
          .json({ message: `utilisateur ou mot de passe incorrect` });
      }

      formattedUser = {
        id: user.id,
        name: user.username,
        createdAt: user.created_at,
        role_id: user.role_id,
      };

      req.session.user = formattedUser;
      console.log(
        chalk.bgGreen("{ formattedUser }>>>>>>", Object.values(formattedUser))
      );

      const token = jwt.sign(
        { email, user: formattedUser, user_id: formattedUser.id },
        process.env.SECRET,
        {
          expiresIn: "8h",
        }
      );

      console.log(chalk.bgBlack("{ TOKEN }>>>>>>", token));

      res.json({ name: formattedUser.name, user_id: formattedUser.id, token });
    } catch (err) {
      formattedUser = nul;
      console.error(chalk.bgRedBright(err));

      res
        .status(500)
        .json({ message: `utilisateur non inscrit`, formattedUser });
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `utilisateur non isncrit`,
        formattedUser,
      });
    }
  },

  async profile(req, res) {
    const reqValeus = Object.values(req.token);

    const userMail = reqValeus[0];
    const created_at = reqValeus[1].createdAt;
    const userName = reqValeus[1].name;
    const userId = reqValeus[1].id;

    const userFavorites = await userModel.findFavoritesByUserId(userId);

    const userAromatheques = await userModel.findAromathequeByUserId(userId);

    const user = await userModel.getUserById(userId);
    let userImage = user.image;

    res.status(200).json({
      Message: `Vous etes bien authentifié avec l'email `,
      userMail: userMail,
      created_at: created_at,
      userName: userName,
      userFavorites: userFavorites,
      userAromatheques: userAromatheques,
      userImage: userImage,
      userId: userId,
    });
  },

  updateUsernameIndexPage(req, res) {
    res.json({ Message: "Changer le Pseudo" });
  },

  async updateUsername(req, res) {
    const userId = req.params.id;
    const { username } = req.body;
    console.log(chalk.bgBlack("{ userId }>>>>>>", userId));
    console.log(chalk.bgBlue("{ username }>>>>>>", username));

    if (!username) {
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `Tous les champs n'ont pas été remplis`,
      });
      return res
        .status(500)
        .json({ message: `Tous les champs doivent être remplis` });
    }

    try {
      const usernameExisted = await userModel.getUserByUsername(username);
      console.log(chalk.bgYellow("{ usernameExisted }>>>>>>", usernameExisted));

      if (usernameExisted) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `Ce nom d'utilisateur est déjà pris`,
        });
        return res
          .status(500)
          .json({ message: `Ce nom d'utilisateur est déjà pris.` });
      }

      const user = await userModel.getUserById(userId);
      console.log(chalk.bgCyan("{ userName }>>>>>>", user.username));

      if (!user) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `utilisateur incorrect`,
        });
        return res.status(500).json({ message: `utilisateur incorrect` });
      }

      console.log("req.token.user.id:", req.token.user.id);
      console.log("user.id:", user.id);

      if (req.token.user.id !== parseInt(user.id)) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `Vous etes connecté avec l' utilisateur ${req.token.user.name} et vous essayez de modifier avec utilisateur ${user.username}`,
        });
        return res
          .status(500)
          .json({
            error: `Vous etes connecté avec l' utilisateur ${req.token.user.name} et vous essayez de modifier avec utilisateur ${user.username}`,
          });
      }

      await userModel.updateUsername(userId, username);
      console.log("username dans udpateUsername>>>>", username);
      res.json({
        message: `Le Pseudo a été modifié avec succès`,
        username: username,
      });
    } catch (error) {
      console.error(chalk.bgRedBright(error));

      res
        .status(500)
        .json({ error: `Erreur lors de la modification du Pseudo` });
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `Erreur lors de la modification du Pseudo`,
      });
    }
  },

  updatePasswordIndexPage(req, res) {
    res.json({ message: `Changer de mot de passe` });
  },

  async updatePassword(req, res) {
    const { oldPassword, password, confirmPassword } = req.body;
    const userId = req.params.id;

    if (!oldPassword || !password || !confirmPassword) {
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `Tous les champs n'ont pas été remplis`,
      });
      return res
        .status(500)
        .json({ message: `Tous les champs doivent être remplis` });
    }

    try {
      const user = await userModel.getUserById(userId);

      if (!user) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `utilisateur incorrect`,
        });
        return res.status(500).json({ message: `utilisateur incorrect` });
      }

      if (password !== confirmPassword) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `Le nouveaux mots de passe ne correspondent pas`,
        });
        return res
          .status(500)
          .json({ message: `Le nouveaux mots de passe ne correspondent pas` });
      }

      if (req.token.user.id !== parseInt(user.id)) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `Vous etes connecté avec l' utilisateur ${req.token.user.name} et vous essayez de modifier avec utilisateur ${user.username}`,
        });
        return res
          .status(500)
          .json({
            error: `Vous etes connecté avec l' utilisateur ${req.token.user.name} et vous essayez de modifier avec utilisateur ${user.username}`,
          });
      }

      const passwordMatch = await bcrypt.compare(oldPassword, user.password);
      if (!passwordMatch) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `Mot de passe incorrect`,
        });
        return res.status(500).json({ message: `Mot de passe incorrect` });
      }

      if (oldPassword === password) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `Le nouveau mot de passe doit être différent de l'ancien mot de passe`,
        });
        return res
          .status(500)
          .json({
            message: `Le nouveau mot de passe doit être différent de l'ancien mot de passe`,
          });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await userModel.updateUserPassword(userId, hashedPassword);
      res.json({ message: `Le mot de passe a été modifié avec succès` });
    } catch (error) {
      console.error(chalk.bgRedBright(error));

      res
        .status(500)
        .json({
          error: `Erreur lors de la modification du mot de passe de ${user.name} `,
        });
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `Erreur lors de la modification du mot de passe de ${user.name} `,
      });
    }
  },

  forgotPasswordIndexPage(req, res) {
    res.json({ message: `Recuperation du mot de passe` });
  },

  async sendPasswordResetEmail(req, res) {
    console.log("req.body>>>>>", req.body);
    const { email } = req.body;
    console.log(chalk.bgBlack("{ email }>>>>>>", email));

    try {
      const user = await userModel.getUserByMail(email);
      console.log(chalk.bgGreen("{ user }>>>>>>", email));

      if (!user) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `Le compte n'existe pas ${email}`,
        });
        return res.status(404).json(`Le compte n'existe pas ${email}`);
      }

      const token = jwt.sign(
        { email: user.mail, userId: user.id },
        process.env.SECRET,
        {
          expiresIn: "10m",
        }
      );
      console.log(
        chalk.bgBlack(
          "{ email: user.mail, userId: user.id }>>>>>>",
          Object.values({ email: user.mail, userId: user.id })
        )
      );
      console.log(chalk.bgBlack("{ TOKEN }>>>>>>", token));

      await mail.sendPasswordResetEmail(user, token);

      res.json({
        Message: `Le compte existe et le mail a été envoyé`,
        token: token,
      });
    } catch (error) {
      console.error(chalk.bgRedBright(error));

      res
        .status(500)
        .json({ error: `Erreur lors de la récuperation du compte` });
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `Erreur lors de la récuperation du compte`,
      });
    }
  },

  async resetPasswordIndexPage(req, res) {
    const { id, token } = req.params;
    console.log(chalk.bgBlack("{ id }>>>>>>", id));
    console.log(chalk.bgBlack("{ token }>>>>>>", token));

    try {
      const user = await userModel.getUserById(id);
      console.log(chalk.bgBlack("{ user.id }>>>>>>", id));

      if (!user) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `Le compte n'existe pas`,
        });
        return res.status(400).json({ message: `Le compte n'existe pas` });
      }

      const verify = jwt.verify(token, process.env.SECRET);
      console.log(chalk.bgBlue("{ verify }>>>>>>", verify.email));

      if (!verify) {
        return res.status(400).json({ Message: `Utilisateur non autorisé` });
      }

      res.json({ Message: `Utilisateur autorisé` });
    } catch (error) {
      console.error(chalk.bgRedBright(error));

      res
        .status(500)
        .json({ error: `Erreur lors de la récupération du mot de passe` });
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `Erreur lors de la récupération du mot de passe `,
      });
    }
  },

  async resetPassword(req, res) {
    const { id, token } = req.params;
    const { password, confirmPassword } = req.body;

    console.log(chalk.bgBlack("{ id }>>>>>>", id));
    console.log(chalk.bgBlack("{ token }>>>>>>", token));
    console.log(chalk.bgBlack("{ password }>>>>>>", password));
    console.log(chalk.bgBlack("{ confirmPassword }>>>>>>", confirmPassword));

    if (!password || !confirmPassword) {
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `Tous les champs n'ont pas été remplis`,
      });
      return res
        .status(400)
        .json({ message: `Tous les champs doivent être remplis` });
    }
    try {
      const user = await userModel.getUserById(id);
      console.log(chalk.bgBlue("{ user.id }>>>>>>", id));

      if (!user) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `Le compte n'existe pas`,
        });
        return res.status(400).json({ message: `Le compte n'existe pas` });
      }

      const verify = jwt.verify(token, process.env.SECRET);
      console.log(chalk.bgBlue("{ verify }>>>>>>", verify.email));

      if (!verify) {
        res.json({ Message: `Ce n'est pas bon` });
      }

      if (password !== confirmPassword) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `Le nouveaux mots de passe ne correspondent pas`,
        });
        return res
          .status(400)
          .json({ message: `Le nouveaux mots de passe ne correspondent pas` });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await userModel.updateUserPassword(id, hashedPassword);
      res.json({ message: `Le mot de passe a été modifié avec succès` });
    } catch (error) {
      console.error(chalk.bgRedBright(error));

      res
        .status(500)
        .json({ error: `Erreur lors de la modification du mot de passe` });
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `Erreur lors de la modification du mot de passe`,
      });
    }
  },

  async addPicture(req, res) {
    const userId = req.params.id;
    console.log("{ userId }>>>>>>", userId);

    console.log("{ req.file }>>>>>>", req.file);

    const file = req.file.filename;
    console.log(chalk.bgCyan("{ picture }>>>>>>", file));

    try {
      const user = await userModel.addUserPicture(userId, file);
      console.log(chalk.bgGreen("{ user }>>>>>>", Object.values(user)));
      res.status(200).json({ message: `L'image a bien été téléchargé`, file });
    } catch (error) {
      console.error(chalk.bgRedBright(error));

      res
        .status(500)
        .json({ error: `Erreur lors du téléchargement de l'image` });
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `Erreur lors du téléchargement de l'image`,
      });
    }
  },

  streamPicture(req, res) {
    const file = req.params.file;
    console.log("file dans stream Picture", file);
    fs.createReadStream(`server/public/upload/${file}`).pipe(res);
  },

  async addFavorite(req, res) {
    const { user_id, oil_id } = req.body;
    console.log(chalk.bgGreen("{ formattedUser }>>>>>>", "user_id " + user_id));
    console.log(chalk.bgGreen("{ formattedUser }>>>>>>", "oil_id " + oil_id));

    try {
      const user = await userModel.getUserById(user_id);

      if (req.token.user.id !== parseInt(user_id)) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `Vous etes connecté avec l' utilisateur ${req.token.user.name} et vous essayez d'ajouter avec utilisateur ${user.username}`,
        });
        return res
          .status(500)
          .json({
            error: `Vous etes connecté avec l' utilisateur ${req.token.user.name} et vous essayez d'ajouter avec utilisateur ${user.username}`,
          });
      }

      const oil = await oilModel.getOneOilById(oil_id);
      console.log(chalk.bgYellow("{ oil_id }>>>>>>", +oil_id));

      if (!oil) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `Huile non trouvée avec l'id  ${oil_id}`,
        });
        return res
          .status(500)
          .json({ error: `Huile non trouvée avec l'id  ${oil_id}` });
      }

      const userFavorites = await userModel.findFavoritesByUserId(user_id);
      console.log(
        chalk.bgWhite("{ userFavorites }>>>>>>", userFavorites.length)
      );

      const oilAlreadyExists = userFavorites.some(
        (favorite) => favorite.oil_id === parseInt(oil_id)
      );

      if (oilAlreadyExists) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `L'huile est déja dans vos favoris ${user.username}`,
        });
        return res
          .status(500)
          .json({
            Message: `L'huile est déja dans vos favoris ${user.username}`,
          });
      }

      const updatedFavorites = await userModel.addFavoritsUser(user_id, oil_id);

      res.status(200).json({ message: `Favori ajouté.`, updatedFavorites });
    } catch (err) {
      console.error(chalk.bgRedBright(err));

      res.status(500).json({ error: "Erreur lors de l'ajout du favori" });
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `Erreur lors de l'ajout du favori de l'user_id ${user_id} et de l'huile_id ${oil_id}`,
      });
    }
  },

  async deleteFavorite(req, res) {
    const { user_id } = req.body;
    const oil_id = req.params.id;
    console.log(chalk.bgBlue("{ req.body }>>>>>>", "user_id " + user_id));
    console.log(chalk.bgBlue("{ req.params.id }>>>>>>", "oil_id " + oil_id));

    try {
      const user = await userModel.getUserById(user_id);
      console.log(chalk.bgGreen("{ user }>>>>>>", user));
      console.log(chalk.bgYellow("{ user_id }>>>>>>", user_id));
      console.log(chalk.bgYellow("{ user.id }>>>>>>", user.id));

      if (req.token.user.id !== parseInt(user_id)) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `Vous etes connecté avec l' utilisateur ${req.token.user.name} et vous essayez de supprimer avec utilisateur ${user.username}`,
        });
        return res
          .status(500)
          .json({
            error: `Vous etes connecté avec l' utilisateur ${req.token.user.name} et vous essayez de supprimer avec utilisateur ${user.username}`,
          });
      }

      const oil = await oilModel.getOneOilById(oil_id);
      console.log(chalk.bgYellow("{ oil_id }>>>>>>", +oil_id));

      if (!oil) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `Huile non trouvée ${oil}`,
        });
        return res.status(500).json({ error: `Huile non trouvée.` });
      }

      const userFavorites = await userModel.findFavoritesByUserId(user_id);
      console.log(
        chalk.bgBlue("{ userFavorites }>>>>>>", Object.values(userFavorites))
      );
      console.log(
        chalk.bgBlue("{ userFavorites.oil_id }>>>>>>", userFavorites[0].oil_id)
      );

      if (userFavorites.length === 0) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `L'huile n'est pas dans les favoris de ${user.username}`,
        });
        return res
          .status(500)
          .json({
            Message: `L'huile n'est pas dans les favoris de ${user.username}`,
          });
      }

      const favorite = await userModel.deleteFavoritsUser(user_id, oil_id);
      console.log(chalk.bgBlue("{ huile favorite id }>>>>>>", oil_id));

      res.status(200).json({ message: `Favori supprimé`, favorite });
    } catch (err) {
      console.error(chalk.bgRedBright(err));
      res
        .status(500)
        .json({ error: `Erreur lors de la suppression du favori` });

      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `Erreur lors de la suppression du favori`,
      });
    }
  },

  async addAromatheque(req, res) {
    const { user_id, oil_id } = req.body;

    try {
      const user = await userModel.getUserById(user_id);
      console.log(chalk.bgBlue("{ user }>>>>>>", user.mail));

      if (req.token.user.id !== parseInt(user_id)) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `Vous etes connecté avec l' utilisateur ${req.token.user.name} et vous essayez d'ajouter avec utilisateur ${user.username}`,
        });
        return res
          .status(500)
          .json({
            error: `Vous etes connecté avec l' utilisateur ${req.token.user.name} et vous essayez d'ajouter avec utilisateur ${user.username}`,
          });
      }

      const oil = await oilModel.getOneOilById(oil_id);

      if (!oil) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `Huile non trouvée avec l'id ${oil_id}`,
        });
        return res
          .status(500)
          .json({ error: `Huile non trouvée avec l'id ${oil_id}` });
      }

      const userAromatheque = await userModel.findAromathequeByUserId(user_id);
      console.log(
        chalk.bgWhite("{ userFavorites }>>>>>>", userAromatheque.length)
      );

      const oilInAromathequeAlreadyExists = userAromatheque.some(
        (aromatheque) => aromatheque.oil_id === parseInt(oil_id)
      );

      if (oilInAromathequeAlreadyExists) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `L'huile est déja dans votre Aromatheque ${user.username}`,
        });
        return res.status(500).json({
          Message: `L'huile est déja dans votre Aromatheque ${user.username}`,
        });
      }

      const updatedAromatheque = await userModel.addAromathequeUser(
        user_id,
        oil_id
      );

      res
        .status(200)
        .json({ message: `Aromatheque ajouté.`, updatedAromatheque });
    } catch (err) {
      console.error(chalk.bgRedBright(err));
      res
        .status(500)
        .json({ error: "Erreur lors de l'ajout de l'aromatheque" });

      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `Erreur lors de l'ajout de l'aromatheque de l'user_id ${user_id} et de l'huile_id ${oil_id}`,
      });
    }
  },

  async deleteAromatheque(req, res) {
    const { user_id } = req.body;
    const oil_id = req.params.id;
    console.log(chalk.bgBlue("{ req.body }>>>>>>", "user_id " + user_id));
    console.log(chalk.bgBlue("{ req.params.id }>>>>>>", "oil_id " + oil_id));

    try {
      const user = await userModel.getUserById(user_id);
      console.log(chalk.bgGreen("{ user }>>>>>>", user));

      if (req.token.user.id !== parseInt(user_id)) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `Vous etes connecté avec l' utilisateur ${req.token.user.name} et vous essayez de supprimer avec utilisateur ${user.username}`,
        });
        return res
          .status(500)
          .json({
            error: `Vous etes connecté avec l' utilisateur ${req.token.user.name} et vous essayez de supprimer avec utilisateur ${user.username}`,
          });
      }

      const oil = await oilModel.getOneOilById(oil_id);
      if (!oil) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `Huile non trouvée` + oil,
        });
        return res.status(500).json({ error: `Huile non trouvée` });
      }

      const userAromatheque = await userModel.findAromathequeByUserId(user_id);

      if (userAromatheque.length === 0) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `L'huile n'est pas dans l'Aromatheque de ${user.username}`,
        });
        return res.status(500).json({
          Message: `L'huile n'est pas dans l'Aromatheque de ${user.username}`,
        });
      }

      const aromatheque = await userModel.deleteAromathequeUser(
        user_id,
        oil_id
      );

      res.status(200).json({ message: `aromatheque supprimé`, aromatheque });
    } catch (err) {
      console.error(chalk.bgRedBright(err));
      res
        .status(500)
        .json({ error: `Erreur lors de la suppression de l'aromatheque` });

      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: "Erreur lors de la suppression de l'aromatheque",
      });
    }
  },

  logout(req, res) {
    delete req.session.user;
    delete req.token;

    res.json({ message: `déconnexion` });
  },
};

module.exports = userController;
