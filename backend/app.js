require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Mengarah langsung ke file database di dalam folder config
const sequelize = require("./config/database");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// routes
app.use("/menu", require("./routes/menuRoutes"));
app.use("/orders", require("./routes/orderRoutes"));
app.use("/tables", require("./routes/tableRoutes"));

sequelize.sync().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on port " + (process.env.PORT || 3000));
  });
});