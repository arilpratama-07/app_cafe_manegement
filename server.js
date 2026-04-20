require('dotenv').config();

const http = require('http'); // ← HARUS ADA
const express = require('express');

const app = express();
const server = http.createServer(app);

server.listen(process.env.PORT, () => {
    console.log("Server jalan di port " + process.env.PORT);
});