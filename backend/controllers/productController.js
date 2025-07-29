import Productmodel from "../models/productModel.js";


const getProducts = async (req, res) => {
    const products = await Productmodel.find()
    res.status(200).json({
        products: products,
        message: "Products fetched successfully",
        error: false
    });
};

export default getProducts;