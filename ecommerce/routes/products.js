const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/productManager.js');
const productManager = new ProductManager('./data/productos.json');

router.get('/', (req, res) => {
    const limit = req.query.limit;
    const products = productManager.getProducts();
    if (limit) {
        return res.json(products.slice(0, limit));
    }
    res.json(products);
});

router.get('/:pid', (req, res) => {
    const product = productManager.getProductById(parseInt(req.params.pid));
    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
});

router.post('/', (req, res) => {
    const newProduct = req.body;
    productManager.addProduct(newProduct);
    res.status(201).json(newProduct);
});

router.put('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const updatedProduct = productManager.updateProduct(productId, req.body);
    if (!updatedProduct) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(updatedProduct);
});

router.delete('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const product = productManager.getProductById(productId);
    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    productManager.deleteProduct(productId);
    res.status(204).send();
});

module.exports = router;
