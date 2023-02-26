const jwt = require("jsonwebtoken");

const auth = {
  // verification du token
  checkToken(req, res, next) {
    try {
      // Split le token en 2 partie bearer et le token  => Récuperer que le 1 element du tableau
      const token = req.headers.authorization.split(" ")[1];

      // vérifier le token générer et le stocker dans la request
      //Middleware pour garder la session active
      req.token = jwt.verify(token, process.env.SECRET);

      console.log("token validé de: ", Object.values(req.token));

      next();
    } catch {
      res.status(401).json({ Message: "Token d'authentification invalide" });
    }
  },

  // middleware d'erreur 404 
  notFound (req, res, next) {

    // Instance de error 
    const error = new Error(`La page demandée est ${req.url}`);
    error.status = 400;
    
    res.json({ Message : "la page que vous cherchez n'existe pas"})

    next(console.error(error));
}, 
};


module.exports = auth;






// code a regarder et a utiliser plus tard 
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
