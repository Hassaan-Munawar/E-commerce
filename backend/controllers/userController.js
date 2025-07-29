import Usermodel from "../models/userModel.js";


const getUsers = async (req, res) => {
    try {
        const users = await Usermodel.find()
        res.status(200).json({
            users: users,
            message: "Users fetched successfully",
            error: false
        });
        
    } catch (error) {
        res.status(500).json({
            message: "Error fetching users",
            details: error.message,
            error: true,
        });
        
    };
};

export default getUsers;