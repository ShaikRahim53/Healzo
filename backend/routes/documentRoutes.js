const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../db");

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // Only allow PDF files
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

// Upload a document
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { filename, size, path: filepath } = req.file;

    // Save file metadata to database
    const query =
      "INSERT INTO documents (filename, filepath, filesize, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *";
    const result = await db.query(query, [
      req.file.originalname,
      filepath,
      size,
    ]);

    res.status(201).json({
      message: "File uploaded successfully",
      document: result.rows[0],
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

// Get all documents
router.get("/", async (req, res) => {
  try {
    const query = "SELECT * FROM documents ORDER BY created_at DESC";
    const result = await db.query(query);

    console.log(result);
    res.status(200).json({
      documents: result.rows,
    });
  } catch (error) {
    console.error("Fetch documents error:", error);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

// Download a document
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch document from database
    const query = "SELECT * FROM documents WHERE id = $1";
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Document not found" });
    }

    const document = result.rows[0];
    const filePath = document.filepath;

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found on server" });
    }

    // Send file for download
    res.download(filePath, document.filename);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ error: "Failed to download document" });
  }
});

// Delete a document
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch document from database
    const query = "SELECT * FROM documents WHERE id = $1";
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Document not found" });
    }

    const document = result.rows[0];
    const filePath = document.filepath;

    // Delete file from filesystem
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete record from database
    const deleteQuery = "DELETE FROM documents WHERE id = $1";
    await db.query(deleteQuery, [id]);

    res.status(200).json({
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete document" });
  }
});

module.exports = router;
