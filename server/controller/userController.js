const { userModel, oilModel } = require("../models");
// Module JWT pour les Token
const jwt = require("jsonwebtoken");
// logger des erreurs client
const logger = require("../service/logger");
// hacher le mot de passe
const bcrypt = require("bcrypt");
// la seul qui marche avec require  "chalk": "^4.1.2",
const chalk = require("chalk");
// module file system (lire, ecrire..) un fichier (C'est pour multer)
const fs = require("fs");
// module nodemailer pour les envois des mail auto (reset password)
const { mail } = require("../service");






const userController = {
  // Module Home Page
  homePage(req, res) {
    res.json({ message: `Bienvenu sur Aromatokä` });
  },


  // Module signUp Page
  indexSignupPage(req, res) {
    res.json({ message: `Inscription` });
  },


  // Module signUp page pour l'inscription (formulaire)
  async signup(req, res) {
    // recupere les donnée du body
    const formData = req.body;
    // console.log(chalk.bgBlue("{ formData.username }>>>>>>", formData.username));
    // console.log(chalk.bgBlue("{ formData.mail }>>>>>>", formData.email));

    try {
      // Appel la bdd et insert les nouvelle donnée
      await userModel.insertUser(formData);
      res.status(201).json({ Message: "Bienvenu ", name: formData.username });
    } catch (err) {
      console.error(chalk.bgRedBright(err));

      res.status(500).json({ message: `Le Pseudo ou l'email est déjà utilisé` });
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `Le Pseudo ou l'email est déjà utilisé`,
      });
    }
  },


  // Module Login Page (GET)
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
          message: `utilisateur ou mot de passe incorrect`,
        });
        return res.status(500).json({ message: `utilisateur ou mot de passe incorrect` });
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
      console.log(chalk.bgGreen("{ formattedUser }>>>>>>", Object.values(formattedUser)))

      // Générer un refresh token
      const refreshToken = jwt.sign({ email: user.email, user_id: user.id }, process.env.SECRET, {
        expiresIn: "20s",
      });

      // Stocker le refresh token dans la session de l'utilisateur
      req.session.refreshToken = refreshToken;

      // generation du token grace a l'email d'identification et une durée de 120min pour le token
      // j'envoi aussi les info de la session grace au payload que j'envoi dans la session user

      const token = jwt.sign({ email, user: formattedUser, user_id:formattedUser.id },process.env.SECRET,
        {
          expiresIn: "10s",
        }
      );

      console.log(chalk.bgBlack("{ TOKEN }>>>>>>", token));
      // console.log(chalk.bgGrey("{ formattedUser.id }>>>>>>", formattedUser.id));

      // Si l'utilisateur existe et le mot de passe est correct on le connecte et on renvoi le token
      res.json({ name: formattedUser.name, user_id:formattedUser.id,  token });
    } catch (err) {
      console.error(chalk.bgRedBright(err));

      res.status(500).json({ message: `utilisateur non inscrit`, formattedUser });
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `utilisateur non isncrit`, formattedUser
      });
    }
  },


  // Module profile
  async profile(req, res) {
    // Avoir les valeurs de l'objet du token depuis req.token
    const reqValeus = Object.values(req.token);
    // console.log(chalk.bgCyan("{ reqValeus }>>>>>>", reqValeus));
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

    // Récupérer l'aromatheque de l'user
    const userAromatheques = await userModel.findAromathequeByUserId(userId);
    // console.log(chalk.bgBlue("{ userFavorites }>>>>>>", userFavorites[0].oil_id));

    // Récupérer l'user (solution de secours)
    const user = await userModel.getUserById(userId);
    let userImage = user.image;
    // console.log(chalk.bgGreen("{ user }>>>>>>", Object.values((user))))
    // console.log(chalk.bgCyan("userImage>>>>>>>>", userImage))

    res.status(200).json({
      Message: `Vous etes bien authentifié avec l'email `,
      userMail: userMail,
      created_at: created_at,
      userName: userName,
      userFavorites: userFavorites,
      userAromatheques:userAromatheques,
      userImage: userImage,
      userId: userId
    });
  },



  // update Username IndexPage
  updateUsernameIndexPage (req, res) {
    res.json({Message : "Changer le Pseudo"})
  },


  // Module pour modifier le Pseudo.
  async updateUsername (req, res) {
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
      return res.status(500).json({ message: `Tous les champs doivent être remplis` });
    };

    try {

      // Cherche d'abord si le nom d'utilisateur existe déjà
      const usernameExisted = await userModel.getUserByUsername(username)
      console.log(chalk.bgYellow("{ usernameExisted }>>>>>>", usernameExisted));


      // Verifie si l'utilisateur existe déjà
      if(usernameExisted) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `Ce nom d'utilisateur est déjà pris`,
        });
        return res.status(500).json({ message: `Ce nom d'utilisateur est déjà pris.` });
      }
      
      const user = await userModel.getUserById(userId)
      console.log(chalk.bgCyan("{ userName }>>>>>>", user.username));

      
      // Si l'utilisateur n'existe pas ou le mot de passe est incorrect, afficher une erreur
      if (!user) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `utilisateur incorrect`,
        });
        return res.status(500).json({ message: `utilisateur incorrect` });
      };

      // check si l'id de la personne connecté et celle qui veut modifier sont les meme.
      if (req.token.user.id !== parseInt(user.id)) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `Vous etes connecté avec l' utilisateur ${req.token.user.name} et vous essayez de modifier avec utilisateur ${user.username}`,
        });
        return res.status(500).json({ error: `Vous etes connecté avec l' utilisateur ${req.token.user.name} et vous essayez de modifier avec utilisateur ${user.username}`,  });
      };



      await userModel.updateUsername(userId, username)
      console.log("username dans udpateUsername>>>>", username)
      res.json({  message: `Le Pseudo a été modifié avec succès`, 
                  username: username
              });

    } catch (error) {
      console.error(chalk.bgRedBright(error));

      res.status(500).json({ error: `Erreur lors de la modification du Pseudo` });
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `Erreur lors de la modification du Pseudo`
      });
    }
  },



  // Module pour modifier le mot de passe (GET)
  updatePasswordIndexPage(req, res) {
    res.json({ message: `Changer de mot de passe` });   
  },


  // Module pour modifier le mot de passe.
  async updatePassword (req, res) {
    const { oldPassword, password, confirmPassword } = req.body;
    // console.log(chalk.bgBlue("{ oldPassword  }>>>>>>", oldPassword ));
    // console.log(chalk.bgBlue("{ password }>>>>>>", password ));
    // console.log(chalk.bgBlue("{ confirmPassword }>>>>>>", confirmPassword));
    const userId = req.params.id
    // console.log(chalk.bgBlack("{ userId }>>>>>>", userId));

     // Vérifier que toutes les données (not null) sont présentes
    if (!oldPassword ||!password ||!confirmPassword) {
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `Tous les champs n'ont pas été remplis`,
      });
      return res.status(500).json({ message: `Tous les champs doivent être remplis` });
    }

    try {
      const user = await userModel.getUserById(userId)
      // console.log(chalk.bgCyan("{ user }>>>>>>", Object.values(user)));

      // Si l'utilisateur n'existe pas ou le mot de passe est incorrect, afficher une erreur
      if (!user) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `utilisateur incorrect`,
        });
        return res.status(500).json({ message: `utilisateur incorrect` });
      };

       // Vérifier que le nouveau mot de passe correspond à la confirmation
      if (password !== confirmPassword) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `Le nouveaux mots de passe ne correspondent pas`,
        });
        return res.status(500).json({ message: `Le nouveaux mots de passe ne correspondent pas` });
      };

      // check si l'id de la personne connecté et celle qui veut add sont les meme.
      if (req.token.user.id !== parseInt(user.id)) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `Vous etes connecté avec l' utilisateur ${req.token.user.name} et vous essayez de modifier avec utilisateur ${user.username}`,
        });
        return res.status(500).json({ error: `Vous etes connecté avec l' utilisateur ${req.token.user.name} et vous essayez de modifier avec utilisateur ${user.username}`,  });
      };

      const passwordMatch = await bcrypt.compare(oldPassword, user.password);
      if (!passwordMatch) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `Mot de passe incorrect` ,
        });
        return res.status(500).json({ message: `Mot de passe incorrect` });
      }

      // Vérifier que le nouveau mot de passe est différent de l'ancien mot de passe
      if (oldPassword === password) {
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `Le nouveau mot de passe doit être différent de l'ancien mot de passe`,
        });
        return res.status(500).json({ message: `Le nouveau mot de passe doit être différent de l'ancien mot de passe` });
      };

       // Hasher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // mettre a jour le nouveau mot de passe 
      await userModel.updateUserPassword(userId, hashedPassword)
      res.json({ message: `Le mot de passe a été modifié avec succès` });

    } catch (error) {
      console.error(chalk.bgRedBright(error));

      res.status(500).json({ error: `Erreur lors de la modification du mot de passe de ${user.name} ` });
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `Erreur lors de la modification du mot de passe de ${user.name} `
      });
    }
  },


  // Module mot de passe oublié Page
  forgotPasswordIndexPage(req, res) {
    res.json({ message: `Recuperation du mot de passe` });   
  },


  // module mot de passe oublié
  async sendPasswordResetEmail (req, res) {
    // console.log("req.body>>>>>", req.body)
    const {email} = req.body
    // console.log(chalk.bgBlack("{ email }>>>>>>", email));

    try {
      const user = await userModel.getUserByMail(email)
      console.log(chalk.bgGreen("{ user }>>>>>>", email));
      // console.log(chalk.bgCyan("{ user.mail }>>>>>>", user.mail));

      if (!user) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `Le compte n'existe pas ${email}`
        });
        return res.json(`Le compte n'existe pas ${email}`)
      }

      // generation du token grace a l'email d'identification et une durée de 10min pour le token
      const token = jwt.sign({ email: user.mail, userId: user.id },process.env.SECRET,
        {
          expiresIn: "10m",
        }
      );
      // console.log(chalk.bgBlack("{ email: user.mail, userId: user.id }>>>>>>", Object.values({ email: user.mail, userId: user.id })));
      console.log(chalk.bgBlack("{ TOKEN }>>>>>>", token));

      await mail.sendPasswordResetEmail(user,token)
      
      res.json({Message : `Le compte existe et le mail a été envoyé`, token:token })
    } catch (error) {
      console.error(chalk.bgRedBright(error));

      res.status(500).json({ error: `Erreur lors de la récuperation du compte` });
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `Erreur lors de la récuperation du compte`
      });
    }
  },


  // Module réinitialisation du mot de passe Page
  async resetPasswordIndexPage (req, res) {
    const {id, token} = req.params
    // console.log(chalk.bgBlack("{ id }>>>>>>", id));
    // console.log(chalk.bgBlack("{ token }>>>>>>", token));

    try{
      // appel l'user par son id depuis la bdd
      const user = await userModel.getUserById(id)
      console.log(chalk.bgBlack("{ user.id }>>>>>>", id));

      // check si l'user existe
      if (!user) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `Le compte n'existe pas`
        });
        return res.json(`Le compte n'existe pas`)
      }

      // Avoir les valeurs de l'objet du token depuis req.token
      const verify = jwt.verify(token, process.env.SECRET);
      console.log(chalk.bgBlue("{ verify }>>>>>>", verify.email));

      if (!verify) {
        res.json({Message : `Utilisateur non autorisé`});
      }

      res.json({Message: `Utilisateur autorisé`})
    } catch (error) {
      console.error(chalk.bgRedBright(error));

      res.status(500).json({ error: `Erreur lors de la récupération du mot de passe` });
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `Erreur lors de la récupération du mot de passe `
      });
    }
  },


  // Module réinitialisation du mot de passe form
  async resetPassword (req, res) {
    const {id, token} = req.params
    const {password, confirmPassword } = req.body;

     // Vérifier que toutes les données (not null) sont présentes
     if (!password ||!confirmPassword) {
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `Tous les champs n'ont pas été remplis`,
      });
      return res.status(500).json({ message: `Tous les champs doivent être remplis` });
    }
    try{

      // appel l'user par son id depuis la bdd
      const user = await userModel.getUserById(id)
      console.log(chalk.bgBlue("{ user.id }>>>>>>", id));

      // check si l'user existe
      if (!user) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `Le compte n'existe pas`
        });
        return res.json(`Le compte n'existe pas`)
      }

      // Avoir les valeurs de l'objet du token depuis req.token
      const verify = jwt.verify(token, process.env.SECRET);
      console.log(chalk.bgBlue("{ verify }>>>>>>", verify.email));

      if (!verify) {
        res.json({Message : `Ce n'est pas bon`});
      }

     
      // Vérifier que le nouveau mot de passe correspond à la confirmation
      if (password !== confirmPassword) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `Le nouveaux mots de passe ne correspondent pas`,
        });
        return res.status(500).json({ message: `Le nouveaux mots de passe ne correspondent pas` });
      }

      // Hasher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // mettre a jour le nouveau mot de passe 
      await userModel.updateUserPassword(id, hashedPassword)
      res.json({ message: `Le mot de passe a été modifié avec succès` });
    } catch (error) {
      console.error(chalk.bgRedBright(error));

      res.status(500).json({ error: `Erreur lors de la modification du mot de passe` });
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `Erreur lors de la modification du mot de passe`
      });
    }
  },


  // Module pour ajouter une photo au profile
  async addPicture(req, res) {
    const userId = req.params.id;
    console.log("{ userId }>>>>>>", userId);

    console.log("{ req.file }>>>>>>", req.file);

    // récupere le chemin de l'image uploadée
    const file = req.file.filename;
    // console.log(chalk.bgCyan("{ picture }>>>>>>", file));
    

    try {

      const user = await userModel.addUserPicture(userId, file);
      console.log(chalk.bgGreen("{ user }>>>>>>", Object.values(user)));
      res.status(200).json({ message: `L'image a bien été téléchargé`, file });


    } catch (error) {
      console.error(chalk.bgRedBright(error));

      res.status(500).json({ error: `Erreur lors du téléchargement de l'image` });
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `Erreur lors du téléchargement de l'image`,
      });
    }
  },


  // Module stream Image
  streamPicture(req, res) {
    const file = req.params.file;
    fs.createReadStream(`server/public/upload/${file}`).pipe(res);
  },



  // Module pour ajouter les huile au favoris
  async addFavorite(req, res) {
    const { user_id, oil_id } = req.body;
    console.log(chalk.bgGreen("{ formattedUser }>>>>>>","user_id " + user_id));
    console.log(chalk.bgGreen("{ formattedUser }>>>>>>","oil_id " + oil_id));

    try {

      // recupére l'user
      const user = await userModel.getUserById(user_id);
      // console.log(chalk.bgBlue("{ user }>>>>>>", user.mail));

      // check si l'id de la personne connecté et celle qui veut add sont les meme.
      if (req.token.user.id !== parseInt(user_id)) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `Vous etes connecté avec l' utilisateur ${req.token.user.name} et vous essayez d'ajouter avec utilisateur ${user.username}`,
        });
        return res.status(500).json({ error: `Vous etes connecté avec l' utilisateur ${req.token.user.name} et vous essayez d'ajouter avec utilisateur ${user.username}`,  });
      }

      // Recuépere de l'id de l'huile
      const oil = await oilModel.getOneOilById(oil_id);
      console.log(chalk.bgYellow("{ oil_id }>>>>>>", +oil_id));
      // Check pour voir si l'huile existe bien
      if (!oil) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `Huile non trouvée avec l'id  ${oil_id}`
        });
        return res.status(500).json({ error: `Huile non trouvée avec l'id  ${oil_id}` });
      }

      // Regarde les favoris de l'user dans la fonction findByuser du models
      const userFavorites = await userModel.findFavoritesByUserId(user_id);
      console.log(chalk.bgWhite("{ userFavorites }>>>>>>", userFavorites.length));
      // console.log(chalk.bgWhite("{ userFavorites }>>>>>>", JSON.stringify(userFavorites)));


      // Vérifie si l'huile à ajouter est déjà dans les favoris de l'utilisateur
      const oilAlreadyExists = userFavorites.some(favorite => favorite.oil_id === parseInt(oil_id));
      // console.log(chalk.bgWhite("oilAlreadyExists", oilAlreadyExists)); => True ou false
      // console.log(chalk.blue("userFavorites", userFavorites));
      // console.log(chalk.green("oil_id", oil_id));


      // condition pour voir si l'huile à ajouté est déja dans les favoris de l'utilisateur
      if (oilAlreadyExists) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message:`L'huile est déja dans vos favoris ${user.username}`
        });
        return res.status(500).json({Message:  `L'huile est déja dans vos favoris ${user.username}`});
      }

      // Ajoute l'huile aux favoris de l'user
      const updatedFavorites = await userModel.addFavoritsUser(user_id, oil_id);
      // console.log(chalk.bgBlue("{ updatedFavorites }>>>>>>", updatedFavorites));

      res.status(200).json({ message: `Favori ajouté.`, updatedFavorites });
    } catch (err) {
      console.error(chalk.bgRedBright(err));

      res.status(500).json({ error: "Erreur lors de l'ajout du favori" });
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message:
        `Erreur lors de l'ajout du favori de l'user_id ${user_id} et de l'huile_id ${oil_id}`
      });
    }
  },


  // Module pour supprimer les huile des favoris
  async deleteFavorite(req, res) {
    const { user_id } = req.body;
    const oil_id = req.params.id;
    console.log(chalk.bgBlue("{ req.body }>>>>>>","user_id " + user_id));
    console.log(chalk.bgBlue("{ req.params.id }>>>>>>", "oil_id " + oil_id));

    try {
      // recupére l'user
      const user = await userModel.getUserById(user_id);
      console.log(chalk.bgGreen("{ user }>>>>>>", user));
      console.log(chalk.bgYellow("{ user_id }>>>>>>", user_id));
      console.log(chalk.bgYellow("{ user.id }>>>>>>", user.id));

      // check si l'id de la personne connecté et celle qui veut supprimer sont les meme.
      if (req.token.user.id !== parseInt(user_id)) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `Vous etes connecté avec l' utilisateur ${req.token.user.name} et vous essayez de supprimer avec utilisateur ${user.username}`,
        });
        return res.status(500).json({ error: `Vous etes connecté avec l' utilisateur ${req.token.user.name} et vous essayez de supprimer avec utilisateur ${user.username}`,  });
      }

      // Recuépere de l'id de l'huile
      const oil = await oilModel.getOneOilById(oil_id);
      console.log(chalk.bgYellow("{ oil_id }>>>>>>", +oil_id));

      // Check pour voir si l'huile existe bien
      if (!oil) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `Huile non trouvée ${oil}`
        });
        return res.status(500).json({ error: `Huile non trouvée.` });
      }

      // Récupère les favoris de l'utilisateur
      const userFavorites = await userModel.findFavoritesByUserId(user_id);
      console.log(chalk.bgBlue("{ userFavorites }>>>>>>", Object.values(userFavorites)));
      console.log(chalk.bgBlue("{ userFavorites.oil_id }>>>>>>", userFavorites[0].oil_id));

      // verifie si je posséde au moins une huile dans les fav
      if (userFavorites.length === 0) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message:
          `L'huile n'est pas dans les favoris de ${user.username}`
        });
        return res.status(500).json({ Message:`L'huile n'est pas dans les favoris de ${user.username}`});
      }

      // Supprime l'huile aux favoris de l'user
      const favorite = await userModel.deleteFavoritsUser(user_id, oil_id);
      console.log(chalk.bgBlue("{ huile favorite id }>>>>>>", oil_id));

      res.status(200).json({ message: `Favori supprimé`, favorite });
    } catch (err) {
      console.error(chalk.bgRedBright(err));
      res.status(500).json({ error: `Erreur lors de la suppression du favori` });

      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `Erreur lors de la suppression du favori`,
      });
    }
  },


  // Module pour ajouter les huile a son aromatheque
  async addAromatheque(req, res) {
    const { user_id, oil_id } = req.body;
    // console.log(chalk.bgGreen("{ formattedUser }>>>>>>","user_id " + user_id));
    // console.log(chalk.bgGreen("{ formattedUser }>>>>>>","oil_id " + oil_id));

    try {

      // recupére l'user
      const user = await userModel.getUserById(user_id);
      console.log(chalk.bgBlue("{ user }>>>>>>", user.mail));

      // check si l'id de la personne connecté et celle qui veut add sont les meme.
      if (req.token.user.id !== parseInt(user_id)) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `Vous etes connecté avec l' utilisateur ${req.token.user.name} et vous essayez d'ajouter avec utilisateur ${user.username}`,
        });
        return res.status(500).json({ error: `Vous etes connecté avec l' utilisateur ${req.token.user.name} et vous essayez d'ajouter avec utilisateur ${user.username}`,  });
      }

      // Recuépere de l'id de l'huile
      const oil = await oilModel.getOneOilById(oil_id);
      // console.log(chalk.bgYellow("{ oil_id }>>>>>>", +oil_id));
      // Check pour voir si l'huile existe bien
      if (!oil) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message: `Huile non trouvée avec l'id ${oil_id}`
        });
        return res.status(500).json({ error: `Huile non trouvée avec l'id ${oil_id}`});
      }

      // Regarde l'aromatheque de l'user dans la fonction findByUser du models
      const userAromatheque = await userModel.findAromathequeByUserId(user_id);
      console.log(chalk.bgWhite("{ userFavorites }>>>>>>", userAromatheque.length));
      // console.log(chalk.bgWhite("{ userFavorites }>>>>>>", userFavorites.oil_id));


      // Vérifie si l'huile à ajouter est déjà dans les favoris de l'utilisateur
      const oilInAromathequeAlreadyExists = userAromatheque.some(aromatheque => aromatheque.oil_id === parseInt(oil_id));
      // console.log(chalk.bgWhite("oilInAromathequeAlreadyExists", oilInAromathequeAlreadyExists));
      // console.log(chalk.blue("userAromatheque", userAromatheque));
      // console.log(chalk.green("oil_id", oil_id));


      // condition pour voir si l'huile à ajouté est déja dans l'aromatheque de l'utilisateur
      if (oilInAromathequeAlreadyExists) {
        logger.customerLogger.log("error", {
          url: req.url,
          method: req.method,
          message:
          `L'huile est déja dans votre Aromatheque ${user.username}`
        });
        return res.status(500).json({
            Message:`L'huile est déja dans votre Aromatheque ${user.username}`
          });
      }

      // Ajoute l'huile a l'aromatheque de l'user
      const updatedAromatheque = await userModel.addAromathequeUser(user_id, oil_id);
      // console.log(chalk.bgBlue("{ updatedAromatheque }>>>>>>", updatedAromatheque));

      res
        .status(200)
        .json({ message: `Aromatheque ajouté.`, updatedAromatheque });
    } catch (err) {
      console.error(chalk.bgRedBright(err));
      res.status(500).json({ error: "Erreur lors de l'ajout de l'aromatheque" });

      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message:
        `Erreur lors de l'ajout de l'aromatheque de l'user_id ${user_id} et de l'huile_id ${oil_id}`
      });
    }
  },


  

// Module pour supprimer une huile de l'aromatheque
async deleteAromatheque(req, res) {
    const { user_id } = req.body;
    const oil_id = req.params.id;
    console.log(chalk.bgBlue("{ req.body }>>>>>>","user_id " + user_id));
    console.log(chalk.bgBlue("{ req.params.id }>>>>>>", "oil_id " + oil_id));

  try {
    // recupére l'user
    const user = await userModel.getUserById(user_id);
    console.log(chalk.bgGreen("{ user }>>>>>>", user));
    // console.log(chalk.bgYellow("{ user_id }>>>>>>", user_id));
    // console.log(chalk.bgYellow("{ user.id }>>>>>>", user.id));

    // check si l'id de la personne connecté et celle qui veut supprimer sont les meme.
    if (req.token.user.id !== parseInt(user_id)) {
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `Vous etes connecté avec l' utilisateur ${req.token.user.name} et vous essayez de supprimer avec utilisateur ${user.username}`,
      });
      return res.status(500).json({ error: `Vous etes connecté avec l' utilisateur ${req.token.user.name} et vous essayez de supprimer avec utilisateur ${user.username}`,  });
    }

    // Recuépere de l'id de l'huile
    const oil = await oilModel.getOneOilById(oil_id);
    // console.log(chalk.bgYellow("{ oil_id }>>>>>>", oil_id));
    // Check pour voir si l'huile existe bien
    if (!oil) {
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message: `Huile non trouvée` + oil
      });
      return res.status(500).json({ error: `Huile non trouvée` });
    }

    // Récupère l'aromatheque de l'utilisateur
    const userAromatheque = await userModel.findAromathequeByUserId(user_id);
    // console.log(chalk.bgBlue("{ userFavorites }>>>>>>", Object.values(userFavorites)));
    // console.log(chalk.bgBlue("{ userFavorites.oil_id }>>>>>>", userAromatheque[0].oil_id));

    // verifie si je posséde au moins une huile dans l'aromatheque
    if (userAromatheque.length === 0) {
      logger.customerLogger.log("error", {
        url: req.url,
        method: req.method,
        message:
        `L'huile n'est pas dans l'Aromatheque de ${user.username}`,
      });
      return res
        .status(500)
        .json({
          Message:
          `L'huile n'est pas dans l'Aromatheque de ${user.username}`
        });
    }

    // Supprime l'huile de aromatheque de l'user
    const aromatheque = await userModel.deleteAromathequeUser(user_id, oil_id);
    // console.log(chalk.bgBlue("{ huile favorite id }>>>>>>", oil_id));

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


  // Module pour se deconnecter
  logout(req, res) {
    // supprimer la session enregistré et son token
    delete req.session.user;
    delete req.token;

    res.json({ message: `déconnexion` });
  },
};


module.exports = userController;

