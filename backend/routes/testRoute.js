// testRoute.js was used during initial testing. It is now a noop placeholder.
const express = require("express");
const router = express.Router();

router.use((req, res) => {
  res
    .status(410)
    .json({ error: "Deprecated test route - use /api/documents instead" });
});

module.exports = router;
