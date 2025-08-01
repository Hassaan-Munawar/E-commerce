import Usermodel from "../models/userModel.js";


const getUser = async (req, res) => {
    try {

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

const editUser = async (req, res) => {
    try {
        const user = await Usermodel.findOneAndUpdate({ _id: req.body.id }, { cart: req.body.cart })
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true
            });
        }
        else {
            user.cart = req.body.cart;
            res.status(200).json({
                data: user,
                message: "User updated successfully",
                error: false
            });
        }

    }
    catch (error) {
        res.status(500).json({
            message: "Error updating user",
            details: error.message,
            error: true
        });

    }
}


export { getUser, editUser };