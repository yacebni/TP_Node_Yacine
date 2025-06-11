import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { app } from './app.js';

dotenv.config();

async function connectDB() {
    await mongoose.connect(process.env.MONGO_URI)
}
connectDB().catch((err) => {
    console.log("Connexion à MongoDB a échoué", err)
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});