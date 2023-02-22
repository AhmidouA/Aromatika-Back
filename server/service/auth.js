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

module.exports = auth;
