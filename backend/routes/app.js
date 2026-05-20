require("dotenv").config();

const express = require("express");
const cors = require("cors"); //// Import middleware CORS
const bodyParser = require("body-parser"); // // Import body-parser untuk membaca JSON

const { sequelize } = require("./models");

const app = express();

app.use(cors()); // Mengaktifkan CORS untuk semua route API
app.use(bodyParser.json()); // Mengubah request JSON menjadi object JavaScript

app.use("/menu", require("./routes/menuRoutes"));
app.use("/orders", require("./routes/orderRoutes"));
app.use("/tables", require("./routes/tableRoutes"));

sequelize.sync().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("Server running on port " + process.env.PORT);
  });
});
// Tambahkan ini di app.js
app.use((req, res, next) => {
  console.log(`${req.method} request ke ${req.url}`);
  next();
});

app.use("/menu", require("./routes/menuRoutes"));

