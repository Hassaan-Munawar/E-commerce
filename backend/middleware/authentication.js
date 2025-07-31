import jwt from "jsonwebtoken";
import Usermodel from "../models/userModel.js";

export async function authenticateUser(req, res, next) {
    const bearerToken = req.headers?.authorization;
    if (!bearerToken)
        return res.status(403).json({
            message: "Token not provided",
            error: true,
        })

    const token = bearerToken.split(" ")[1];

    const decoded = jwt.verify(token, process.env.AUTH_SECRET);
    if (decoded) {
        const user = await Usermodel.findById(decoded._id)
        if (user) {
            req.user = user
            next()
        } else {
            return res.status(403).json({
                message: "User not found",
                error: true,
            })
        }
    } else {
        return res.status(403).json({
            message: "Invalid Token",
            error: true,
        })
    }
}