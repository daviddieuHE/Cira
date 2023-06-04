const express = require("express");
const client = require("../db");
const router = express.Router();
const multer = require("multer");

const imageUpload = multer();

router.post("/report", imageUpload.single("image"), async (req, res) => {
  const { date, longitude, latitude, description, category } = req.body;
  const file = req.file;
  try {
    await client.query(
      'INSERT INTO reports (created_at, "user", latitude, longitude, picture, description, category) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [
        date,
        1,
        latitude,
        longitude,
        `data:${file.mimetype};base64, ${file.buffer.toString("base64")}`,
        description,
        category,
      ]
    );
    res.send("OK");
  } catch (err) {
    console.log(err);
    res.send("ERROR");
  }
});

router.get("/reports", async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM reports WHERE "user" = 1 AND archived = false ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.send("ERROR");
  }
});

router.post("/status", async (req, res) => {
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

router.post("/archive", async (req, res) => {
  const { id } = req.body;
  try {
    await client.query("UPDATE reports SET archived = true WHERE id = $1", [
      id,
    ]);
    res.send("OK");
  } catch (err) {
    console.log(err);
    res.send("ERROR");
  }
});

module.exports = router;
