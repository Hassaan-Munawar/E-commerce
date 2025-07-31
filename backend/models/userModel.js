import mongoose from "mongoose";
const { Schema } = mongoose;
const userSchema = new Schema({
    "_id": { "type": "string", "required": true },
    "full_name": { "type": "string", "required": true },
    "email": { "type": "string", "required": true, "unique": true },
    "cart": {
        "type": [
            {
                "productId": { "type": mongoose.Types.ObjectId, "ref": "Products", "required": true },
                "quantity": { "type": "number", "default": 1 }
            }
        ],
        "default": []
    }
})

const Usermodel = mongoose.model('Users', userSchema);

export default Usermodel;