// Import the mongoose module
//const mongoose = require("mongoose");
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs'
import path from 'path'
import { Tour } from './../../models/tour.model.js'

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//configure l'environnement
dotenv.config();



//const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD)
const connectString = "mongodb+srv://yacinebouanani04:Fopr23sRcNrD2otc@cluster0.juxabuc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
//console.log(DB)

async function connectDB() {
    await mongoose.connect(connectString)
}
connectDB().catch((err) => {
    console.log("Connexion à MongoDB a échoué", err)
})


// READ JSON file



const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))
console.log(tours)
//IMPORT data
const importData = async () => {
    try {
        await Tour.create(tours)
        console.log('Data successfully loaded')
        process.exit()
    }
    catch (err) {
        console.log(err)
    }
}

const deleteData = async () => {
    try {
        await Tour.deleteMany(); //delete all documents
        console.log('Data successfully deleted')
        process.exit()
    }
    catch (err) {
        console.log(err)
    }
}

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}
//console.log(process.argv[2])