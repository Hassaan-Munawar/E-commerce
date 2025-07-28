import express from 'express';
import "dotenv/config"
import cors from "cors";
import connectDB from './config/connectDb.js';

const app = express();

app.use(express.json());
app.use(cors())

connectDB();


app.get('/', (req, res) => {
    res.send('Hi World!');
})



app.listen(process.env.PORT, () => console.log("Server is running on PORT " + process.env.PORT));
