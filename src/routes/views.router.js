import {Router} from "express";
//import products from "../data/products.json" assert {type: "json"};
import Product from "../dao/manager/productdb.js";
import { cartModel } from "../dao/mongo/cart.model.js";
import { productModel } from "../dao/mongo/product.model.js";
import Cart from "../dao/manager/cartdb.js";
import cookieParser from "cookie-parser";


const productManager = new Product ();

const views = Router ();

views.use(cookieParser("<COOKIESECRET>"));

async function cartCookie(req, res) {
	let { cart } = req.signedCookies;
	if (!cart) {
		const createCart = await cartModel.create({products: []});
		const cartId = createCart.id
		res.cookie("cart", cartId, {signed: true,});
		cart = cartId;
	};
	return cart;
}

views.get("/login", async (req, res) => {
	try {
		if(req.session.user){
			return res.status(200).render("home", {
				user: req.session.user,
				documentTitle: "Home",
			});
		};
        return res.status(200).render("login", {
				documentTitle: "Login",
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

views.get("/register", async (req, res) => {
	try {
		if(req.session.user){
			return res.status(200).render("home", {
				user: req.session.user,
				documentTitle: "Home",
			});
		};

		return res.status(200).render("register", {
			documentTitle: "Register",
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

views.get ('/', async (req, res) =>{
    try {
		if(!req.session.user){
			return res.status(200).render("login", {
			documentTitle: "Login",
			});
		};

		return res.status(200).render("home", {
			user: req.session.user,
			documentTitle: "Home",
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});


views.get('/products', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(200).render("login", {
             documentTitle: "Login",
            });
        };

        const cart = await cartCookie(req, res);
        let { limit, page, query, sort } = req.query;


        if (page == undefined || page == "" || page < 1 || isNaN(page)) {
            page = 1;
        };


        if (limit == undefined || limit == "" || limit <= 1 || isNaN(limit)) {
            limit = 10;
        };


        if (sort == undefined || (sort !== 'asc' && sort !== 'desc') || !isNaN(sort)) {
            sort = "asc";
        };

        const filter = { category: query };
        const options = {
            page,
            limit,
            customLabels: {
                totalPages: 'totalPages',
                hasPrevPage: 'hasPrevPage',
                hasNextPage: 'hasNextPage',
                prevPage: 'prevPage',
                nextPage: 'nextPage',
                docs: 'data',
            },
            lean: true
        };

        const products = await productModel.paginate({}, options);
        const filteredProducts = await productModel.paginate(filter, options);


        if (sort === "asc") {

            filteredProducts.data.sort((a, b) => a.price - b.price);
            products.data.sort((a, b) => a.price - b.price);
        } else {

            filteredProducts.data.sort((a, b) => b.price - a.price);
            products.data.sort((a, b) => b.price - a.price);
        }


        if (products.data.length <= 0) {
            return res.status(200).send(`There's no products for this search`);
        };

        if (filteredProducts.data.length > 0) {
            return res.status(200).render("products", {
                status: "success",
                payload: filteredProducts.data,
                user: req.session.user,
                page,
                limit,
                query,
                sort,
                cart,
                totalPages: filteredProducts.totalPages,
                hasPrevPage: filteredProducts.hasPrevPage,
                hasNextPage: filteredProducts.hasNextPage,
                prevPage: filteredProducts.prevPage,
                nextPage: filteredProducts.nextPage,
                documentTitle: "Products",
                
            });
        }

        return res.status(200).render("products", {
            status: "success",
            payload: products.data,
            user: req.session.user,
            page,
            limit,
            query,
            sort,
            cart,
            totalPages: products.totalPages,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            documentTitle: "Products",
          
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    };
});

views.get("/products/:pid", async (req, res) => {
	try {
		if(!req.session.user){
			return res.status(200).render("login", {
            documentTitle: "Login",
			});
		};

		const cart = await cartCookie(req, res);
		const { pid } = req.params;
		const product = await productModel.findById(pid).lean();

		return res.status(200).render("product", {
			product,
			cart,
			documentTitle: "Product",
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

views.get("/realtimeproducts", (req, res) => {
	try {
		if(!req.session.user){
			return res.status(200).render("login", {				documentTitle: "Login",
			});
		};
		
		return res.status(200).render("realTimeProducts", {
			documentTitle: "Socket",
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
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
        
		if(!req.session.user){
			return res.status(200).render("login", {
			documentTitle: "Login",
			});
		};
		
		
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

