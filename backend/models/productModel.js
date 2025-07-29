import mongoose from "mongoose";
const { Schema } = mongoose;
const productSchema = new Schema({

    "id": { "type": "number", "required": true },
    "title": { "type": "string", "required": true },
    "description": { "type": "string", "required": true },
    "category": { "type": "string", "required": true },
    "price": { "type": "number", "required": true },
    "discountPercentage": { "type": "number", "required": true },
    "rating": { "type": "number", "minimum": 0, "maximum": 5, "required": true },
    "stock": { "type": "number", "required": true },
    "tags": {
        "type": "array",
        "items": { "type": "string" },
        "required": true
    },
    "brand": { "type": "string", "required": true },
    "sku": { "type": "string", "required": true },
    "weight": { "type": "number", "required": true },
    "dimensions": {
        "type": "object",
        "properties": {
            "width": { "type": "number", "required": true },
            "height": { "type": "number", "required": true },
            "depth": { "type": "number", "required": true }
        },
        "required": true
    },
    "warrantyInformation": { "type": "string", "required": true },
    "shippingInformation": { "type": "string", "required": true },
    "availabilityStatus": {
        "type": "string",
        "enum": ["In Stock", "Out of Stock", "Low Stock"],
        "required": true
    },
    "reviews": {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "rating": { "type": "number", "minimum": 1, "maximum": 5, "required": true },
                "comment": { "type": "string", "required": true },
                "date": { "type": "string", "format": "date-time", "required": true },
                "reviewerName": { "type": "string", "required": true },
                "reviewerEmail": { "type": "string", "format": "email", "required": true }
            },
            "required": true
        },
        "required": true
    },
    "returnPolicy": { "type": "string", "required": true },
    "minimumOrderQuantity": { "type": "number", "required": true },
    "meta": {
        "type": "object",
        "properties": {
            "createdAt": { "type": "string", "format": "date-time", "required": true },
            "updatedAt": { "type": "string", "format": "date-time", "required": true },
            "barcode": { "type": "string", "required": true },
            "qrCode": { "type": "string", "format": "uri", "required": true }
        },
        "required": true
    },
    "images": {
        "type": "array",
        "items": { "type": "string", "format": "uri" },
        "required": true
    },
    "thumbnail": { "type": "string", "format": "uri", "required": true }




});

const Productmodel = mongoose.model('Products', productSchema);

export default Productmodel;