const { userModel, oilModel } = require("../models");
// module JWT pour les Token
const jwt = require("jsonwebtoken");

// Option refresh du token stocker
const refreshTokenExpiration = "7d";

const userController = {
  homePage(req, res) {
    res.json({ message: "Bienvenu sur Aromatokä" });
  },

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
      res
        .status(400)
        .json({ message: "Le Pseudo ou l'email est déjà utilisé" });
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
        createdAt: user.created_at,
        role_id: user.role_id, // Récupérer l'id du rôle à partir de la clé étrangère dans la table utilisateur
      };

      // stock les info de la session dans formattedUser
      req.session.user = formattedUser;
      console.log("formattedUser>>>>>>>", formattedUser);

      // Si l'utilisateur existe et le mot de passe est correct on le connecte et on renvoi le token
      res.json({ message: "connexion", token });
      //res.redirect('/');
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  },

  async profile(req, res) {
    // Avoir les valeurs de l'objet du token depuis req.token
    const reqValeus = Object.values(req.token);
    // console.log("reqValeus>>>>>>>>", reqValeus)

    // La date de creation du compte (Demande du front pour afficher au profil)
    // générer grace a la session user dans login
    const createdAt = req.session.user.createdAt;
    // console.log("createdAt>>>>>>>>", createdAt)
    const userName = req.session.user.name;
    // console.log("userName>>>>>>>>", userName)
    const userId = req.session.user.id;

    const userFavorites = await userModel.findFavoritesByUserId(userId)
    


    // Prendre la 1er valeur de l'objet envoyer = le mail de l'utilisateur
    const reqMailValue = reqValeus[0];
    // console.log("reqMailValue>>>>>>>>", reqMailValue)

    res.status(200).json({
      Message: "Vous etes bien authentifié avec l'email " + reqMailValue,
      createdAt: createdAt,
      userName: userName,
      userFavorites: userFavorites
    });
  },
  async addFavorite(req, res) {
    const { user_id, oil_id } = req.body;
    console.log("{ user_Id, oil_Id }>>>>>>>>", { user_id, oil_id })

    try {
      // Check si l'user est bien inscrit dans la bdd 
    const user = await userModel.getUserById(user_id);
    console.log("{ user }>>>>>>>>",user )
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }
      
      // recuépere de l'id de l'huile 
      const oil = await oilModel.getOilById(oil_id);
      // Check pour voir si l'huile existe bien 
      if (!oil) {
        return res.status(404).json({ error: 'Huile non trouvée.' });
      }

      // Ajoute l'huile aux favoris de l'user
      const favorite = await userModel.addFavoritsUser(user_id, oil_id);
      console.log("{ favorite }>>>>>>>>",favorite )

      res.status(200).json({ message: 'Favori ajouté.', favorite });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de l\'ajout du favori.' });
    }
  },
  
  async deleteFavorite(req, res) {
    const { user_id, oil_id } = req.body;
    console.log("{ { user_Id, oil_Id } }>>>>>>>>",{ user_id, oil_id } )
    try {
         // Check si l'user est bien inscrit dans la bdd 
    const user = await userModel.getUserById(user_id);
    console.log("{ user }>>>>>>>>",user )
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }
       // Recuépere de l'id de l'huile 
      const oil = await oilModel.getOilById(oil_id);
      // Check pour voir si l'huile existe bien 
      if (!oil) {
        return res.status(404).json({ error: 'Huile non trouvée.' });
      }
      // Supprime l'huile aux favoris de l'user
      const favorite = await userModel.deleteFavoritsUser(user_id, oil_id);
      console.log("{ favorite }>>>>>>>>",favorite )
      res.status(200).json({ message: 'Favori supprimé.', favorite });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la suppression du favori.' });
    }
  },
  

  logout(req, res) {
    // supprimer la session enregistré et son token
    delete req.session.user;
    delete req.token;

    res.json({ message: "déconnexion" });
  },
};

module.exports = userController;
