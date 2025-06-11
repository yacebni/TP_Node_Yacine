import mongoose from 'mongoose';
import { app } from './app.js'
//configure l'environnement
//dotenv.config();
//console.log(process.env.DATABASE)
//const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD)

//const LOCAL_DATABASE = url here;
async function connectDB() {
    await mongoose.connect(LOCAL_DATABASE)
}
connectDB().catch((err) => {
    console.log("Connexion à MongoDB a échoué", err)
})



const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`App running on port ${port}`)
})
