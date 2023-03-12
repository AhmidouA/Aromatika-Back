const express = require("express");
// controller de l'utilisateur
const { userController } = require("../controller");
// middleware authentification
const { auth } = require("../service");
// gestion d'image
// const multer = require("multer");
const upload = require('../service/multer');

// gestion d'image
// const upload = multer({dest: 'server/public/upload/'});

const router = express.Router();


/**
 * Un User 
 * @typedef {object} User
 * @property {string} username - Nom de l'utilisateurs
 * @property {string} mail - email de l'utilisateurs
 * @property {string} password - le mot de passe de l'utilisateurs
 * @property {string} role_id - le role de l'utilisateurs
 * @property {string} picture - la photo de l'utilisateurs
 */

/**
 * GET /
 * @summary Affiche la page d'accueil
 * @security bearerAuth
 * @tags User
 * @return {html} 200 - Retourne la page d'accueil
 * @return {object} 500 - Erreur inattendue
 */
//GET / - route pour la home Page (Page d'acceuil)
router.get("/", userController.homePage);


/**
 * GET /signup
 * @summary Affiche la page d'inscription
 * @security bearerAuth
 * @tags User
 * @return {html} 200 - Retourne la page d'inscription
 * @return {object} 500 - Erreur inattendue
 */
// GET /signup - route pour récupere la page formulaire d'inscription
router.get("/signup", userController.indexSignupPage);


/**
 * POST /signup
 * @summary Inscription d'un nouvel user
 * @security bearerAuth
 * @tags User
 * @param {User} request.body.required - Nouvel utilisateur
 * @return {object} 200 - Retourne l'utilisateur créé
 * @return {object} 500 - Le Pseudo ou l'email est déjà utilisé
 */
// POST /signup - route pour completer le formulaire d'inscription
router.post("/signup", userController.signup);


/**
 * GET /login
 * @summary Affiche la page de connexion
 * @security bearerAuth
 * @tags User
 * @return {html} 200 - Retourne la page de connexion
 * @return {object} 500 - Erreur inattendue
 */
//GET /login - route pour récupere la page formulaire de connexion
router.get("/login", userController.indexLoginPage);


/**
 * POST /login
 * @summary Connexion d'un User existant
 * @security bearerAuth
 * @tags User
 * @param {User} request.body.required - Informations de connexion de l'utilisateur
 * @return {object} 200 - Retourne l'utilisateur connecté et le token d'authentification
 * @return {object} 500 - Utilisateur ou mot de passe incorrect
 * @return {object} 500 - Erreur inattendue
 */
// POST /login - route pour completer le formulaire de connexion
router.post("/login", userController.login);


/**
 * GET /logout
 * @summary Déconnexion de l'User
 * @security bearerAuth
 * @tags User
 * @return {object} 200 - Retourne un message de succès
 * @return {object} 500 - Erreur inattendue
 */
//GET /logout - route pour la décoonnexion
router.get("/logout", auth.checkToken, userController.logout);


/**
 * GET /profile
 * @summary Affiche la page de profil de User connecté
 * @security bearerAuth
 * @tags User
 * @return {html} 200 - Retourne la page de profil
 * @return {object} 500 - Utilisateur non trouvé
 */
//GET /profile - route pour le profil de l'utilisateur avec un middleware token
router.get("/profile", auth.checkToken, userController.profile);


/**
 * POST /profile/favorites
 * @summary Ajoute une huile aux favoris de l'User connecté
 * @security bearerAuth
 * @tags User
 * @param {string} request.body.id.required - ID de la recette à ajouter
 * @return {object} 200 - Favori ajouté
 * @return {object} 500 - Utilisateur non trouvé
 * @return {object} 500 - Erreur lors de l'ajout du favori
 */
// POST /profile/favorites - route pour ajouter une huile dans ses favoris
router.post('/profile/favorites', auth.checkToken, userController.addFavorite);


/**
 * DELETE /profile/favorites/{id}
 * @summary Supprime une huile des favoris en fonction de l'ID de le l'huile
 * @security bearerAuth
 * @tags User
 * @param {string} id.path.required - ID de la favorite à supprimer
 * @return {object} 200 - Favoris supprimé
 * @return {object} 500 - Utilisateur non trouvé.
 * @return {object} 500 - L'huile n'est pas dans les favoris de l'utilisateur
 * @return {object} 500 - Erreur lors de la suppression du favori
 */
// DELETE /profile - route pour supprimer une huile de ses favoris
// Pour la méthode DELETE il est important d'inclure 
// l'ID car nous voulons supprimer une ressource existante dans la base de données qui a un ID.
router.delete('/profile/favorites/:id', auth.checkToken, userController.deleteFavorite);


/**
 * POST /profile/aromatheque
 * @summary Ajoute une huile à l'Aromathèque de l'utilisateur connecté
 * @security bearerAuth
 * @tags User
 * @param {string} request.body.id.required - ID de l'huile à ajouter
 * @return {object} 200 - Huile ajoutée
 * @return {object} 500 - Utilisateur non trouvé
 * @return {object} 500 - Erreur lors de l'ajout de l'huile
 */
// POST /profile/aromatheque - route pour ajouter une huile a son Aromatheque
router.post('/profile/aromatheque', auth.checkToken, userController.addAromatheque);


/**
 * DELETE /profile/aromatheque/{id}
 * @summary Supprime une huile de l'Aromathèque en fonction de l'ID de l'huile
 * @security bearerAuth
 * @tags User
 * @param {string} id.path.required - ID de l'huile à supprimer
 * @return {object} 200 - Huile supprimée
 * @return {object} 500 - Utilisateur non trouvé.
 * @return {object} 500 - L'huile n'est pas dans l'Aromathèque de l'utilisateur
 * @return {object} 500 - Erreur lors de la suppression de l'huile
 */
// DELETE /profile/aromatheque/{id} - route pour supprimer une huile de son Aromatheque
// Pour la méthode DELETE il est important d'inclure 
// l'ID car nous voulons supprimer une ressource existante dans la base de données qui a un ID.
router.delete('/profile/aromatheque/:id', auth.checkToken, userController.deleteAromatheque);


/**
 * POST /profile/picture/{id}
 * @summary Ajouter une image de profil pour l'user connecté
 * @security bearerAuth
 * @tags User
 * @param {string} id.path.required - ID de l'utilisateur
 * @param {Image} image.formData.required - Image à ajouter
 * @return {object} 200 - L'image a bien été téléchargé
 * @return {object} 500 - Erreur lors du téléchargement de l'image
 */
// POST /profile/picture/{id} - route pour ajouter une photo 
// Un seul ficher a la fois qui peux etre téléchargé 
// ('image') est le champs renseigner dans le form (champs) de l'uploade
router.post('/profile/picture/:id', upload.single('image'), userController.addPicture);


/**
 * GET /profile/picture/{file}
 * @summary Affiche une image de profil de l'utilisateur connecté
 * @security bearerAuth
 * @tags User
 * @param {string} file.path.required - Nom du fichier image à afficher
 * @return {object} 200 - Image affichée
 * @return {object} 500 - Erreur lors de la lecture du fichier image
 */
// Get /profile/image - route pour stream une photo 
// route pour stream l'image dans le dosser public
router.get('/profile/picture/:file', userController.streamPicture);


module.exports = router;
