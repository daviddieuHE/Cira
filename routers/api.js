const express = require("express");
const client = require("../db");
const router = express.Router();
const multer = require("multer");

// On crée un middleware pour l'upload d'image avec multer
const imageUpload = multer();

// Route pour signaler un incident. L'image est uploadée avec multer.
router.post("/report", imageUpload.single("image"), async (req, res) => {
  const { date, longitude, latitude, description, category } = req.body;
  const file = req.file;
  
// On essaie d'insérer le signalement dans la base de données  
  try {
    await client.query(
      'INSERT INTO reports (created_at, "user", latitude, longitude, picture, description, category) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [
        date,
        1, // Utilisateur hardcodé pour l'instant
        latitude,
        longitude,
        `data:${file.mimetype};base64, ${file.buffer.toString("base64")}`,
        description,
        category,
      ]
    );
// On informe le client que tout s'est bien passé
    res.send("OK");
  } catch (err) {
    console.log(err);
// Si une erreur survient, on envoie "ERROR"    
    res.send("ERROR");
  }
});

// Route pour récupérer tous les signalements non archivés de l'utilisateur 1
router.get("/reports", async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM reports WHERE "user" = 1 AND archived = false ORDER BY created_at DESC');
// On renvoie les résultats sous forme de JSON
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.send("ERROR");
  }
});

//récupère tous les signalements et les tries par ordre de création
router.get("/allreports", async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM reports ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.send("ERROR");
  }
});


// Route pour mettre à jour le statut d'un signalement
router.post("/status", async (req, res) => {
// On récupère l'identifiant et le nouveau statut du signalement
  const { id, status } = req.body;
  try {
    await client.query("UPDATE reports SET status = $1 WHERE id = $2", [
      status,
      id,
    ]);
    res.send("OK");
  } catch (err) {
    console.log(err);
    res.send("ERROR");
  }
});

// Route pour archiver un signalement
router.post("/archive", async (req, res) => {
// On récupère l'identifiant et létat de  l'archivage du signalement à archiver
  const { id, archived } = req.body;
  try {
    await client.query("UPDATE reports SET archived = $2 WHERE id = $1", [
    id,archived,

    ]);
    res.send("OK");
  } catch (err) {
    console.log(err);
    res.send("ERROR");
  }
});

// On exporte le router pour l'utiliser dans une autre partie de l'application
module.exports = router;
