const express = require("express");
const client = require("../db");
const router = express.Router();
const multer = require("multer");
const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/auth");
const bcrypt = require("bcrypt");

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
    res.status(500).send("ERROR");
  }
});

// Route pour récupérer tous les signalements non archivés de l'utilisateur 1
router.get("/reports", async (req, res) => {
  try {
    const result = await client.query(
      'SELECT created_at, description, category, status FROM reports WHERE "user" = 1 AND archived = false ORDER BY created_at DESC'
    );
    // On renvoie les résultats sous forme de JSON
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("ERROR");
  }
});

router.get("/allreports", checkAuth, async (req, res) => {
  try {
    const result = await client.query(
      "SELECT * FROM reports ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("ERROR");
  }
});

router.post("/status", checkAuth, async (req, res) => {
  const { id, status } = req.body;
  try {
    await client.query("UPDATE reports SET status = $1 WHERE id = $2", [
      status,
      id,
    ]);
    res.send("OK");
  } catch (err) {
    console.log(err);
    res.status(500).send("ERROR");
  }
});

router.post("/archive", checkAuth, async (req, res) => {
  const { id, archived } = req.body;
  try {
    await client.query("UPDATE reports SET archived = $2 WHERE id = $1", [
      id,
      archived,
    ]);
    res.send("OK");
  } catch (err) {
    console.log(err);
    res.status(500).send("ERROR");
  }
});

router.get("/alladvertisements", checkAuth, async (req, res) => {
  try {
    const result = await client.query(
      "SELECT * FROM advertisements ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("ERROR");
  }
});

router.get("/advertisements", async (req, res) => {
  try {
    const result = await client.query(
      // Select all advertisements who are active (start_date <= NOW() AND end_date >= NOW() or end_date is null)
      "SELECT * FROM advertisements WHERE (start_date <= NOW() AND (end_date >= NOW() OR end_date IS NULL) AND disabled = false AND archived = false) ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("ERROR");
  }
});

router.post("/advertisement", checkAuth, async (req, res) => {
  const { title, start_date, end_date } = req.body;

  try {
    await client.query(
      "INSERT INTO advertisements (title, start_date, end_date) VALUES ($1, $2, $3)",
      [
        title,
        start_date ? new Date(start_date) : null,
        end_date ? new Date(end_date) : null,
      ]
    );
    res.send("OK");
  } catch (err) {
    console.log(err);
    res.status(500).send("ERROR");
  }
});

router.post("/advertisement/disable", checkAuth, async (req, res) => {
  const { id, disabled } = req.body;
  try {
    await client.query(
      "UPDATE advertisements SET disabled = $2 WHERE id = $1",
      [id, disabled]
    );
    res.send("OK");
  } catch (err) {
    console.log(err);
    res.status(500).send("ERROR");
  }
});

router.post("/advertisement/archive", checkAuth, async (req, res) => {
  const { id, archived } = req.body;
  try {
    await client.query(
      "UPDATE advertisements SET archived = $2 WHERE id = $1",
      [id, archived]
    );
    res.send("OK");
  } catch (err) {
    console.log(err);
    res.status(500).send("ERROR");
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await client.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (user.rows.length === 0) return res.status(400).send("ERROR");
    if (user.rows[0].role !== "admin") return res.status(400).send("ERROR");

    const match = await bcrypt.compare(password, user.rows[0].password);
    if (match) {
      const token = jwt.sign({ username }, process.env.JWT_SECRET);
      res.cookie("token", token, { httpOnly: true }).send("OK");
    } else {
      res.status(400).send("ERROR");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("ERROR");
  }
});

module.exports = router;
