require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const { sequelize } = require("./models");

const app = express();

app.use(cors());
app.use(bodyParser.json());

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