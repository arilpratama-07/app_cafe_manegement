const express = require('express');
var cors = require('cors');
const connection = require('./connection'); 
const userRoute = require('./routes/user'); 
const app = express();

// MIDDLEWARE (Penyaring Data)
app.use(cors()); 
app.use(express.json()); 
// ROUTING
app.use('/user', userRoute); 

module.exports = app;