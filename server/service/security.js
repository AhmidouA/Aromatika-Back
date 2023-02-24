const jwt = require('jsonwebtoken');

const securityService = {
    checkToken(req, res, next) {
        try {
            // Split le token en 2 partie bearer et le token  => Récuperer que le 1 element du tableau
            const token = req.headers.authorization.split(" ")[1];

            // vérifier le token générer et le stocker dans la request
            req.token = jwt.verify(token, process.env.SECRET);
            console.log("token validé de: ", req.token);

            next();
        } catch {
            res.status(401).json({Message: "Token d'authentification invalide"})
        }
    }
}

module.exports = securityService;