const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/productManager.js');
const productManager = new ProductManager('./data/productos.json');

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

router.get('/', (req, res) => {
    const { limit = 10, page = 1, sort, query } = req.query;
    let products = productManager.getProducts();

    if (query) {
        products = products.filter(p => 
            p.category?.toLowerCase().includes(query.toLowerCase()) || 
            (query === 'available' && p.status)
        );
    }

    if (sort) {
        products = products.sort((a, b) => sort === 'asc' ? a.price - b.price : b.price - a.price);
    }

    const totalPages = Math.ceil(products.length / limit);
    const paginatedProducts = products.slice((page - 1) * limit, page * limit);

    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? parseInt(page) + 1 : null;
    const prevLink = prevPage ? `/products?limit=${limit}&page=${prevPage}&sort=${sort}&query=${query}` : null;
    const nextLink = nextPage ? `/products?limit=${limit}&page=${nextPage}&sort=${sort}&query=${query}` : null;

    res.json({
        status: 'success',
        payload: paginatedProducts,
        totalPages,
        prevPage,
        nextPage,
        page: parseInt(page),
        hasPrevPage: prevPage !== null,
        hasNextPage: nextPage !== null,
        prevLink,
        nextLink
    });
});

router.get('/:pid', (req, res) => {
    const product = productManager.getProductById(parseInt(req.params.pid));
    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
});

module.exports = router;
