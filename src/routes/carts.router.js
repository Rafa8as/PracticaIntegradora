import { Router } from "express";
import {cartModel} from "../dao/mongo/cart.model.js";
import {productModel} from "../dao/mongo/product.model.js"
import Cart from "../dao/manager/cartdb.js";

const CartsManager = new Cart ();
const carts = Router ();

carts.get ('/', async (req, res)=>{
    try {
        let result = await CartsManager.getAll();
        return res.status (200).json ({status:"success", payload: result});

    } catch (err){
        return res.status(500).json ({error: err.message});
    };
});

carts.get ('/:id', async (req,res)=>{
    try {
        const {id}= req.params;
        let result = await cartModel.findById (id);
        if (!result) {
            return res.status (200).send (`No hay un carrito con el ID ${id}`);
        };

        return res.status(200).json ({status: "success", payload: result});

    } catch (err) {
        return res.status(500).json ({error: err.message});

    };
});

carts.post ('/',async (req,res)=>{
    try {
		const result = await cartModel.create({
			products: [],
		});

		return res.status(200).json({ status: "success", payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};

});

carts.post ('/:cid/product/:pid', async (req,res)=>{
    try {
        const { cid, pid}= req.params;
        const newProduct = await productModel.findById(pid);
        const cart = await cartModel.findById(cid);
        const productInCart = await cart.products.find (product =>product.code === newProduct.code);

        if (!productInCart){
            const create = {
                $push: {product:{code: newProduct.code, quantity:1}},
            };
            await cartModel.findByIdAndUpdate ({_id: cid}, create);
            const result = await cartModel.findById(cid);
            return res.status (200).json ({status:"success",payload:result});

        };

        await cartModel.findByIdAndUpdate (
            {_id: cid},
            {$inc:{"products.$[elem].quantity": 1}},
            {arrayFilters: [{"elem.code": newProduct.code}]}
        );
        const result = await cartModel.findById (cid);
        return res.status (200).json ({status: "success", payload: result});
    } catch (err) {
        return res.status (500).json ({error: err.message});
    };
});

carts.delete ('/:id', async (req,res)=>{
    try{
        const {id}= req.params;
        await cartModel.deleteOne({_id: id});
        const result = await cartModel.find();
        return res.status(200).json ({status: "success", payload: result});

    } catch (err){
        return res.status (500).json ({error: err.message});
    };
});

export default carts;