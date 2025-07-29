import Productmodel from "../models/productModel.js";


const getProducts = async (req, res) => {
    try {
        const products = await Productmodel.find()
        res.status(200).json({
            products: products,
            message: "Products fetched successfully",
            error: false
        });
        
    } catch (error) {
        res.status(500).json({
            message: "Error fetching products",
            details: error.message,
            error: true,
        });
        
    };
};

export default getProducts;