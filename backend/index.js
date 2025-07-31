import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDb from "./config/connectDb.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());

connectDb();

app.get("/", (req, res) => {
    res.send("Hello from the backend!");
});

app.use("/products", productRoutes);
app.use("/user", userRoutes);

app.listen(process.env.PORT, () => console.log("Server is running on " + "http://localhost:" + process.env.PORT));