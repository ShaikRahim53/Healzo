const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/documents", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM documents");
    res.json(result.rows);
  } catch (error) {
    console.log("DB ERROR => ", error); // ← add this line
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
