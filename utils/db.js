// const dotenv = require('dotenv');
// dotenv.config();

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


const mongoose = require('mongoose');

async function connectToDb() {
    try {
        await mongoose.connect(process.env.DB_CONNECT);
        console.log("Connected to DB");
    } catch(err) {
        console.error("Failed to connect to DB: ", err);
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
}

async function disconnectFromDb() {
    try {
        await mongoose.disconnect();
        console.log("Disconnected from DB");
    } catch (err) {
        console.error("Failed to disconnect from DB:", err);
    }
}

module.exports = { connectToDb, disconnectFromDb };