//require('dotenv').config()
const express = require('express')
const api = require("./routers/api")
const path = require("path")

// Création de l'application Express.
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

// Route qui renvoie le fichier index.html du build de l'application React.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "dashboard", "build", "index.html"))
})

// Serveur de fichiers statiques pour l'application React buildée.
app.use(express.static(path.join(__dirname, "dashboard", "build")));

// Montage du routeur API sur le chemin /api.
app.use("/api", api)

// Lancement de l'application sur le port spécifié.
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})