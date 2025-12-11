const express = require("express");
const cors = require("cors");
require("dotenv").config();

const documentRoutes = require("./routes/documentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Use the routes
app.use("/api/documents", documentRoutes);

app.get("/", (req, res) => {
  res.send("Backend API is working!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
