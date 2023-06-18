// Importer le module 'jsonwebtoken'
const jwt = require("jsonwebtoken");

// Définir le middleware pour vérifier l'authentification
const checkAuth = (req, res, next) => {
  // Récupérer le jeton du cookie
  const token = req.cookies.token;

  // Si aucun jeton n'est présent, renvoyer une réponse '401 Non autorisé'
  if (!token) return res.sendStatus(401);

  try {
    // Vérifier le jeton avec la clé secrète JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Si le jeton est valide, attacher l'utilisateur décodé à la requête
    req.user = decoded;
  } catch (err) {
    // Si une erreur se produit (par exemple, le jeton n'est pas valide), nettoyer le cookie et renvoyer '401 Non autorisé'
    console.log(err);
    return res.clearCookie("token").sendStatus(401);
  }

  // Passer au prochain middleware si tout est en ordre
  next();
};

// Exporter le middleware
module.exports = checkAuth;


