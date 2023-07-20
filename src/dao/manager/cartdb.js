import { cartModel } from "../mongo/cart.model.js";

export default class Cart {
    constructor (){
        console.log ("Cart")

    };
    getAll = async ()=>{
        let carts = await cartModel.find().lean();
        return carts.map (Cart => Cart.toObject ());
    };
    saveCart= async ()=>{
        let result = await cartModel.create(Cart);
        return result;
    }
}
