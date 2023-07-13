import { Router } from "express";
import Product from "../dao/manager/productdb.js";
import { productModel } from "../dao/mongo/product.model.js";


const productManager = new Product();
const products = Router ();

products.get('/', async (req, res) => {
    try {
        const result = await productManager.getAll();
        console.log (result)
        return res.status(200).json({ status: "success", payload: result });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    };
});

products.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { result } = await productModel.findById(id);

        if (!result) {
            return res.status(200).send(`No Hay producto con ese id ${id}`);
        };
        return res.status(200).json({ status: "success", payload: result });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    };
});

products.post('/', async (req, res) => {
    try {
        const { title, description, code, price, stock, category } = req.body;
        if (
            !title ||
            !description ||
            !code ||
            !price ||
            !stock ||
            !category ||
            !price
        ) {
            return res.status(200).send(`Por favor complete todos los campos para crear un producto`);
        };
        const result = await productModel.create({
            title,
            description,
            code,
            price,
            stock,
            category,
        });
        return res.status(200).json({ status: "success", payload: result });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    };
});

products.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, code, price, stock, category } = req.body;
        const product = await productModel.findById(id);

        if (!product) {
            return res.status(200).send(`No hay ningun producto con el ID ${id}`);
        };
        if (
            !title ||
            !description ||
            !code ||
            !price ||
            !stock ||
            !category ||
            !price

        ) {
            return res.status(200).send(`Por Favor complete todos los campos para crera un producto`);
        };
        const newProduct = {
            title,
            description,
            code,
            price,
            stock,
            category,
        };
        await productModel.updateOne({ _id: id }, newProduct);

        const result = await productModel.findById(id);

        return res.status(200).json({ status: "success", payload: result });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    };
});

products.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await productModel.deleteOne({ _id: id });

        const result = await productModel.find();
        return res.status(200).json({ status: "success", payload: result });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    };
});

export default products;