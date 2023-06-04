const pg = require('pg');
const connectionString = process.env.DATABASE_URL || "postgresql://postgres:QWlfN9tBZGV4i4xhqigG@containers-us-west-2.railway.app:7186/railway";
const client = new pg.Client(connectionString);
client.connect();

module.exports = client;
