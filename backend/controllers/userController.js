import Usermodel from "../models/userModel.js";


const getUser = async (req, res) => {
    try {
        console.log(req.body.id);
        
        const user = await Usermodel.findOne({ _id: req.body.id });
        if (!user) {
            let newUser = new Usermodel({
                _id: req.body.id,
                full_name: req.body.full_name,
                email: req.body.email,
                cart: []
            });
            newUser = await newUser.save();

            res.status(200).json({
                data: newUser,
                message: "User added successfully",
                error: false
            });
        }
        else {
            res.status(200).json({
                data: user,
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