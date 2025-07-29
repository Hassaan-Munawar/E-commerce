import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDb from "./config/connectDb.js";
import productRoutes from "./routes/productRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());

connectDb();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/products", productRoutes);

app.listen(process.env.PORT, () => console.log("Server is running on PORT " + process.env.PORT));