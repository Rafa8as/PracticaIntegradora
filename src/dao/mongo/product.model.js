import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = "products";

const productSchema = new mongoose.Schema ({
    title: String,
    description: String,
    code: {
        type: String,
        unique: true,
    },
    price: Number,
    status :{
        type : Boolean,
        default: true,
        unique: false,
    },
    stock: Number,
    category: String,
});

productSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model (productsCollection, productSchema)