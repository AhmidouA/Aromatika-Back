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
 * Un utilisateurs 
 * @typedef {object} utilisateurs
 * @property {string} username - Nom de l'utilisateurs
 * @property {string} mail - email de l'utilisateurs
 * @property {string} password - le mot de passe de l'utilisateurs
 * @property {string} role_id - le role de l'utilisateurs
 * @property {string} picture - la photo de l'utilisateurs
 */

/**
 * GET /api/
 * @summary Affiche la page d'accueil
 * @tags Utilisateurs
 * @return {html} 200 - Retourne la page d'accueil
 * @return {object} 500 - Erreur inattendue
 */
//GET / - route pour la home Page (Page d'acceuil)
router.get("/", userController.homePage);


/**
 * GET /api/signup
 * @summary Affiche la page d'inscription
 * @tags Utilisateurs
 * @return {html} 200 - Retourne la page d'inscription
 * @return {object} 500 - Erreur inattendue
 */
// GET /signup - route pour récupere la page formulaire d'inscription
router.get("/signup", userController.indexSignupPage);


/**
 * POST /api/signup
 * @summary Inscription d'un nouvel utilisateur
 * @tags Utilisateurs
 * @param {Utilisateur} request.body.required - Nouvel utilisateur
 * @return {object} 200 - Retourne l'utilisateur créé
 * @return {object} 500 - Erreur inattendue
 */
// POST /signup - route pour completer le formulaire d'inscription
router.post("/signup", userController.signup);


/**
 * GET /api/login
 * @summary Affiche la page de connexion
 * @tags Utilisateurs
 * @return {html} 200 - Retourne la page de connexion
 * @return {object} 500 - Erreur inattendue
 */
//GET /login - route pour récupere la page formulaire de connexion
router.get("/login", userController.indexLoginPage);


/**
 * POST /api/login
 * @summary Connexion d'un utilisateur existant
 * @tags Utilisateurs
 * @param {Utilisateur} request.body.required - Informations de connexion de l'utilisateur
 * @return {object} 200 - Retourne l'utilisateur connecté et le token d'authentification
 * @return {object} 500 - Utilisateur ou mot de passe incorrect
 * @return {object} 500 - Erreur inattendue
 */
// POST /login - route pour completer le formulaire de connexion
router.post("/login", userController.login);


/**
 * GET /api/logout
 * @summary Déconnexion de l'utilisateur
 * @tags Utilisateurs
 * @security TokenAuth
 * @return {object} 200 - Retourne un message de succès
 * @return {object} 500 - Erreur inattendue
 */
//GET /logout - route pour la décoonnexion
router.get("/logout", auth.checkToken, userController.logout);


/**
 * GET /api/profile
 * @summary Affiche la page de profil de l'utilisateur connecté
 * @tags Utilisateurs
 * @security TokenAuth
 * @return {html} 200 - Retourne la page de profil
 * @return {object} 500 - Utilisateur non trouvé
 * @return {object} 500 - Erreur inattendue
 */
//GET /profile - route pour le profil de l'utilisateur avec un middleware token
router.get("/profile", auth.checkToken, userController.profile);


/**
 * POST /api/profile/favorites
 * @summary Ajoute une huile aux favoris de l'utilisateur connecté
 * @tags Utilisateurs
 * @security BasicAuth
 * @param {string} request.body.id.required - ID de la recette à ajouter
 * @return {object} 200 - Retourne un message de succès
 * @return {object} 500 - Erreur lors de l'ajout du favori
 * @return {object} 500 - Erreur inattendue
 */
// POST /profile/favorites - route pour ajouter un favoris
router.post('/profile/favorites', auth.checkToken, userController.addFavorite);


/**
 * DELETE /profile/favorites/{id}
 * @summary Supprime une huile des favoris en fonction de l'ID de le l'huile
 * @tags Profile
 * @param {string} id.path.required - ID de la favorite à supprimer
 * @return {object} 200 - Favoris supprimé
 * @return {object} 500 - Utilisateur non trouvé.
 * @return {object} 500 - L'huile n'est pas dans les favoris de l'utilisateur
 * @return {object} 500 - Erreur serveur
 */
// DELETE /profile - route pour supprimer un favoris
// Pour la méthode DELETE il est important d'inclure 
// l'ID car nous voulons supprimer une ressource existante dans la base de données qui a un ID.
router.delete('/profile/favorites/:id', auth.checkToken, userController.deleteFavorite);


/**
 * POST /profile/picture/{id}
 * @summary Ajouter une image de profil pour l'utilisateur connecté
 * @tags Profile
 * @param {string} id.path.required - ID de l'utilisateur
 * @param {Image} image.formData.required - Image à ajouter
 * @return {object} 200 - Image ajoutée
 * @return {object} 500 - Erreur lors du téléchargement de l'image
 * @return {object} 500 - Erreur serveur
 */
// POST /profile/image - route pour ajouter une photo 
// Un seul ficher a la fois qui peux etre téléchargé 
// ('image') est le champs renseigner dans le form (champs) de l'uploade
router.post('/profile/picture/:id', auth.checkToken, public.single('image'), userController.addPicture);


module.exports = router;
