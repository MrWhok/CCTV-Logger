const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const imageRoutes = require('./routes/imageRoutes');
const userRoutes = require('./routes/userRoutes');
// const errorHandler = require("./middleware/errorHandler");

const app = express();

// app.use(errorHandler);
app.use(bodyParser.json());
app.use('/staticimages', express.static(path.join(__dirname, '../public/staticimages')));
app.use('/images', imageRoutes);
app.use('/users', userRoutes);

module.exports = app;