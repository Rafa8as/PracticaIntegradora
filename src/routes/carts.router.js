import { Router } from "express";
import {cartModel} from "../dao/mongo/cart.model.js";
import {productModel} from "../dao/mongo/product.model.js"
import Cart from "../dao/manager/cartdb.js";

const CartsManager = new Cart ();
const carts = Router ();


carts.get ('/', async (req, res)=>{
    try {
        let result = await cartModel.find();
        return res.status (200).json ({status:"success", payload: result});

    } catch (err){
        return res.status(500).json ({error: err.message});
    };
});

carts.get ('/:id', async (req,res)=>{
    try {
        const {id}= req.params;
        let result = await cartModel.findById(id).populate ('products._id');
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
        const productInCart = cart.products.find (product =>product._id.toString() === newProduct.id);

        if (!productInCart){
            const create = {
                $push: {product:{_id: newProduct._id, quantity: 1}},
            };
            await cartModel.findByIdAndUpdate ({_id: cid}, create);
            const result = await cartModel.findById(cid);
            return res.status (200).json ({status:"success",payload:result});

        };

        await cartModel.findByIdAndUpdate (
            {_id: cid},
            {$inc:{"products.$[elem].quantity": 1}},
            {arrayFilters: [{"elem._id": newProduct._id}]}
        );
        const result = await cartModel.findById (cid);
        return res.status (200).json ({status: "success", payload: result});
    } catch (err) {
        return res.status (500).json ({error: err.message});
    };
});

carts.put("/:cid", async (req, res) => {
	try {
		const { cid } = req.params;
		let newCart = req.body;
		const cart = await cartModel.findById(cid);

		// Iterar por cada producto
		newCart.forEach( async product => {
			// Validar si la cantidad es correcta, sino corregirla a 1:
			if (product.quantity < 1) {
				console.log(`Invalid value ${product.quantity} for quantity, new value was setted on 1`);
				product.quantity = 1
			};

			// Validar si el producto existe y el stock es suficiente:
			const existProduct = await productModel.findById(product._id);
			if(existProduct && existProduct.stock > product.quantity) {
				// Validar si el producto existe en el carrito:
				const productInCart = cart.products.find(productInCart => productInCart.id === existProduct.id);

				// Si no existe, crearlo:
				if (!productInCart) {
					const create = {
						$push: { products: { _id: existProduct.id, quantity: product.quantity } },
					};
					await cartModel.findByIdAndUpdate({ _id: cid }, create);
				};

				// Si existe, actualizar la cantidad:
				await cartModel.findByIdAndUpdate(
					{ _id: cid },
					{ $set: { "products.$[elem].quantity": product.quantity } },
					{ arrayFilters: [{ "elem._id": existProduct.id }] }
				);
			};
		});

		const result = await cartModel.findById(cid);
		return res.status(200).json({ status: "success", payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});


carts.put("/:cid/product/:pid", async (req, res) => {
	try {
		const { cid, pid } = req.params;
		let newQuantity = req.body.quantity;
		const product = await productModel.findById(pid);

		if(newQuantity > product.stock) {
			console.log(`Insufficient stock ${newQuantity} for product ${product._id}, max ${product.stock}`);
			newQuantity = product.stock;
		}
		
		await cartModel.findByIdAndUpdate(
			{ _id: cid },
			{ $set: { "products.$[elem].quantity": newQuantity } },
			{ arrayFilters: [{ "elem._id": pid }] }
		);

		const result = await cartModel.findById(cid);
		return res.status(200).json({ status: "success", payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});


carts.delete ('/:id', async (req,res)=>{
    try{
        const {id}= req.params;
        await cartModel.findByIdAndUpdate(id,{products: []});
        const result = await cartModel.find();
        return res.status(200).json ({status: "success", payload: result});

    } catch (err){
        return res.status (500).json ({error: err.message});
    };
});
carts.delete("/:cid/products/:pid", async (req, res) => {
	try {
		const { cid, pid } = req.params;
		await cartModel.findByIdAndUpdate(cid, {
			$pull: { products: { _id: pid } }
		})

		const result = await cartModel.find();
		return res.status(200).json({ status: "success", payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

export default carts;