require('dotenv').config();

const { error } = require('console');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
app.use(cors());


mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error',(error)=>console.error(error));
db.once('open',()=>console.log('Connected to Database'));

app.use(express.json());

const imagesRouter = require('./routes/images');
app.use('/images', imagesRouter);

app.listen(3000, () => console.log('Server is running on port 3000'));




