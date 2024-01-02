const jwt = require("jsonwebtoken");

const chalk = require("chalk");

const logger = require("../service/logger");

const auth = {
  checkToken(req, res, next) {
    try {
      const token = req.headers.authorization.split(" ")[1];

      req.token = jwt.verify(token, process.env.SECRET);
      console.log(
        chalk.bgMagenta("token validé de: ", Object.values(req.token))
      );

      next();
    } catch (err) {
      console.log(chalk.bgRedBright("error dans le auth.checkToken", err));
      res.status(401).json({ Message: "Token d'authentification invalide" });
    }
  },

  notFound(req, res, next) {
    const error = new Error(`La page demandée est ${req.url}`);
    error.status = 404;

    res.json({ Message: "la page que vous cherchez n'existe pas" });

    next(console.error(error));
  },

  isAdmin(req, res, next) {
    const roleId = req.session.user.role_id;
    console.log("roleId>>>>>>", roleId);

    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Token d'authentification invalide" });
    }
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET);
      console.log("decodedToken: ", decodedToken);

      if (roleId !== 1) {
        return res.status(401).json({ message: "Non autorisé" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: "Token invalide" });
    }
  },
};

module.exports = auth;