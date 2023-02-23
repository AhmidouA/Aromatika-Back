const auth = (req, res, next) => {
  // on ne souhaite pas oublier l'utilisateur ici, ça sera au logout
  if (req.session?.user) {
    // middleware pour garder la session active
    res.locals.user = req.session.user;
    return next();
  }

  req.status = 403;
  // le redirger vers l'acceuil au logout ou si il ne trouve pas de session active
  return res.redirect("/");
};

// Simple JWT access and refresh tokens
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

module.exports = auth;
