import express from "express";
import "dotenv/config";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/users", (req, res) => {
    res.send("User API Endpoint");
});

app.listen(process.env.PORT, () => console.log("Server is running on PORT " + process.env.PORT))