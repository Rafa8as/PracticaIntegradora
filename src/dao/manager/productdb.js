
import { productModel } from "../mongo/product.model.js";

export default class Product {
    constructor (){
        console.log("Productos")
    }
    getAll = async ()=>{
        let productos = await productModel.find ()
        return productos.map (producto => producto.toObject ());

    }
}