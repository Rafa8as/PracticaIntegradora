import mongoose from "mongoose";

const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema ({
    products: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products'
        },
        quantity: Number,
    }
] 
});

export const cartModel = mongoose.model(cartsCollection,cartsSchema)