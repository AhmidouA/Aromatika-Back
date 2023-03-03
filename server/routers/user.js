const express = require("express");
// controller de l'utilisateur
const { userController } = require("../controller");
// middleware authentification
const { auth } = require("../service");
const multer = require('multer');
// destination stockage (bdd postgres)
const public = multer({ dest: 'public/' });

const router = express.Router();

/**
 * GET / - route pour la home Page (Page d'acceuil)
 */
router.get("/", userController.homePage);

/**
 * GET /signup - route pour récupere la page formulaire d'inscription
 * POST /signup - route pour completer le formulaire d'inscription
 */
router.get("/signup", userController.indexSignupPage);
router.post("/signup", userController.signup);

/**
 * GET /login - route pour récupere la page formulaire de connexion
 * POST /login - route pour completer le formulaire de connexion
 */
router.get("/login", userController.indexLoginPage);
router.post("/login", userController.login);

/**
 * GET /logout - route pour la décoonnexion
 */
router.get("/logout", auth.checkToken, userController.logout);

/**
 * GET /profile - route pour le profil de l'utilisateur avec un middleware token
 */
router.get("/profile", auth.checkToken, userController.profile);

/**
 * POST /profile/favorites - route pour ajouter un favoris
 */
router.post('/profile/favorites', auth.checkToken, userController.addFavorite);

/**
 * DELETE /profile - route pour supprimer un favoris
 * Pour la méthode DELETE il est important d'inclure 
 * l'ID car nous voulons supprimer une ressource existante dans la base de données qui a un ID.
 */
router.delete('/profile/favorites/:id', auth.checkToken, userController.deleteFavorite);

/**
 * POST /profile/image - route pour ajouter une photo
 * Un seul ficher a la fois qui peux etre téléchargé 
 * ('image') est le champs renseigner dans le form (champs) de l'uploade
 */
router.post('/profile/picture/:id', auth.checkToken, public.single('image'), userController.addPicture);


module.exports = router;
