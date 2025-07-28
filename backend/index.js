import express from "express";
import "dotenv/config"
import cors from "cors";
import connectDb from "./config/connectDb.js";

const app = express();


app.use(express.json());
app.use(cors());

connectDb();


app.get('/', (req, res) => {
    res.json([
        { name: "Hassaan Munawar", email: "hassaan@gmail.com" },
        { name: "Hassaan Munawar", email: "hassaan@gmail.com" },
        { name: "Hassaan Munawar", email: "hassaan@gmail.com" },
        { name: "Hassaan Munawar", email: "hassaan@gmail.com" },
        { name: "Hassaan Munawar", email: "hassaan@gmail.com" },

    ]);
});


app.listen(process.env.PORT, () => console.log("Server is running on PORT " + process.env.PORT));
