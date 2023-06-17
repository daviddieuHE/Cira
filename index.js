
const express = require("express");
const api = require("./routers/api");
const path = require("path");
const cookieParser = require("cookie-parser");

// Création de l'application Express.
const app = express();
const port = process.env.PORT || 3000;

require("dotenv").config();

app.use(express.json());
app.use(cookieParser());

// Serveur de fichiers statiques pour l'application React buildée.
app.use(express.static(path.join(__dirname, "dashboard", "build")));

// Montage du routeur API sur le chemin /api.
app.use("/api", api);

// Route qui renvoie le fichier index.html du build de l'application React.
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "dashboard", "build", "index.html"));
});

// Lancement de l'application sur le port spécifié.
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
