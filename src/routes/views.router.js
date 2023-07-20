import {Router} from "express";
//import products from "../data/products.json" assert {type: "json"};
import Product from "../dao/manager/productdb.js";
import { cartModel } from "../dao/mongo/cart.model.js";
import Cart from "../dao/manager/cartdb.js";

const productManager = new Product ();

const views = Router ();

async function cart (req,res) {
    let {cart} = new cart ();
    if (!cart) {
        const createCart = await cartModel.create({products:[]});
        const cartId = createCart.id
        cart = cartId;
    };
    return cart;
} ; 

views.get ('/', async (req, res) =>{
   const result = await productManager.getAll();
   
    res.render ("result", {
        result
    }) 
})

views.get ('/', (req, res)=> {
    res.render ("home", {
        documentTitle: "Home",
        Product,

    });

});

views.get ('/realtimeproducts', (req, res) =>{
    res.render ("realTimeProducts", {
        documentTitle: "Socket",
    });

});

views.get ('/chat', (req, res) =>{
    try {
		return res.status(200).render("chat", {
			documentTitle: "Chat",
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};

});

views.get("/carts/:cid", async (req, res) => {
  

	try {
		
		
		const { cid } = req.params;
		const cart = await cartModel.findById(cid).populate('products._id').lean();

		if(!cart) {
			return res.status(200).send(`Invalid cart ID ${cid}`);
		};

		return res.status(200).render("carts", {
			
			documentTitle: "Carts",
			payload: cart.products,
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

export default views;

