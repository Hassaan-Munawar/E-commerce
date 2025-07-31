import Usermodel from "../models/userModel.js";
import jwt from "jsonwebtoken";


const getUser = async (req, res) => {
    try {
        const user = await Usermodel.findOne({ _id: req.body.id }).lean();
        if (!user) {
            let newUser = new Usermodel({
                _id: req.body.id,
                username: req.body.full_name,
                email: req.body.email,
                cart: []
            });
            newUser = await newUser.save();

            const findUser = await Usermodel.findOne({ _id: req.body.id }).lean();

            const token = jwt.sign(findUser, process.env.AUTH_SECRET);
            res.status(200).json({
                data: { user: findUser, token },
                message: "User added successfully",
                error: false
            });
        }
        else {
            const token = jwt.sign(user, process.env.AUTH_SECRET);
            res.status(200).json({
                data: { user, token },
                message: "User fetched successfully",
                error: false
            });
        }

    } catch (error) {
        res.status(500).json({
            message: "Error fetching user",
            details: error.message,
            error: true,
        });

    };
};




export default getUser;