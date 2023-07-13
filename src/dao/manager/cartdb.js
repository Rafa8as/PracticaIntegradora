import { cartModel } from "../mongo/cart.model.js";

export default class Cart {
    constructor (){
        console.log ("Cart")

    };
    getAll = async ()=>{
        let carts = await cartModel.find ()
        return carts.map (Cart => Cart.toObject ());
    }
}
