const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

const cors = require('cors');
const { connectToDb } = require('./utils/db');
const userRoutes = require('./routes/user.routes');
const processPayloadRoutes = require('./routes/processPayload.routes');

connectToDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("Hello World");
})

app.use('/users', userRoutes);
app.use('/processPayload', processPayloadRoutes);

module.exports = app;