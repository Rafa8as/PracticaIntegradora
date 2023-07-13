import {Router} from "express";
//import products from "../data/products.json" assert {type: "json"};
import Product from "../dao/manager/productdb.js";

const productManager = new Product ();

const views = Router ();

views.get ('/', async (req, res) =>{
   const result = await productManager.getAll();
    console.log (result)
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
    res.render ("chat", {
        documentTitle: "Chat",
    });

});

export default views;

