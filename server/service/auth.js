const jwt = require("jsonwebtoken");
const path = require("path");
const multer = require("multer");
// la seul qui marche avec require  "chalk": "^4.1.2",
const chalk = require("chalk");
// logger des erreurs client
const logger = require("../service/logger");

const auth = {
  // verification du token
  checkToken(req, res, next) {
    try {
      // Split le token en 2 partie bearer et le token  => Récuperer que le 1 element du tableau
      const token = req.headers.authorization.split(" ")[1];

      // vérifier le token générer et le stocker dans la request
      //Middleware pour garder la session active
      req.token = jwt.verify(token, process.env.SECRET);
      console.log(chalk.bgMagenta("token validé de: ", Object.values(req.token)));

      next();
    } catch (err) {
      console.log(chalk.bgRedBright(err));
      res.status(401).json({ Message: "Token d'authentification invalide" });
    }
  },

  // middleware d'erreur 404
  notFound(req, res, next) {
    // Instance de error
    const error = new Error(`La page demandée est ${req.url}`);
    error.status = 400;

    res.json({ Message: "la page que vous cherchez n'existe pas" });

    next(console.error(error));
  },

  // Middleware admin
  isAdmin(req, res, next) {
    // Récupération du role de l'user grace a la session
    const roleId = req.session.user.role_id;
    console.log("roleId>>>>>>", roleId);

    // Vérifie si le token est présent dans la requête
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Token d'authentification invalide" });
    }
    try {
      // Vérifie si le token est valide et récupère les informations de l'utilisateur
      const decodedToken = jwt.verify(token, process.env.SECRET);
      console.log("decodedToken: ", decodedToken);

      // Vérifie si l'utilisateur a le rôle d'administrateur (2)
      if (roleId !== 1) {
        return res.status(401).json({ message: "Non autorisé" });
      }

      // Passe à la suite des middlewares
      next();
    } catch (err) {
      return res.status(401).json({ message: "Token invalide" });
    }
  },


};

module.exports = auth;

// code Sophie a regarder et a utiliser plus tard
// Simple JWT access and refresh tokens
/* 
const jwt = require('jsonwebtoken');
const secretKey = 'my_secret_key';
const accessTokenExpiration = '15m'; // Token expiration time (15 minutes)
const refreshTokenExpiration = '7d'; // Refresh token expiration time (7 days)

// Assuming you have validated the user's credentials and found them to be valid, generate tokens
const generateTokens = (user) => {
  // Create the access token
  const accessTokenPayload = {
    sub: user.id,
    username: user.username,
    role: user.role
  };
  const accessToken = jwt.sign(accessTokenPayload, secretKey, { expiresIn: accessTokenExpiration });

  // Create the refresh token
  const refreshTokenPayload = {
    sub: user.id,
    iat: Date.now() / 1000,
    username: user.username
  };
  const refreshToken = jwt.sign(refreshTokenPayload, secretKey, { expiresIn: refreshTokenExpiration });

  return { accessToken, refreshToken };
};

// Example
const user = {
  id: 1234,
  username: 'johndoe',
  role: 'user'
};

const tokens = generateTokens(user);

console.log('Access token:', tokens.accessToken);
console.log('Refresh token:', tokens.refreshToken);
*/
