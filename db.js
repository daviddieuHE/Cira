const pg = require('pg');

// Récupération de la chaîne de connexion à la base de données à partir des variables d'environnement
// ou utilisation d'une chaîne de connexion par défaut.
const connectionString = process.env.DATABASE_URL || "postgresql://postgres:QWlfN9tBZGV4i4xhqigG@containers-us-west-2.railway.app:7186/railway";

// Création d'un nouveau client PostgreSQL avec la chaîne de connexion spécifiée.
const client = new pg.Client(connectionString);

// Connexion au client à la base de données.
client.connect();

// Exportation du client pour qu'il puisse être utilisé dans d'autres modules.
module.exports = client;
