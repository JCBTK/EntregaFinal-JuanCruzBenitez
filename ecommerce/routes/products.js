const express = require('express');
const router = express.Router();
const ProductManager = require('../productManager');
const productManager = new ProductManager();


router.get('/', async (req, res) => {
    const products = await productManager.getAllProducts();
    res.json(products); 
});
router.get('/:pid', async (req, res) => {
    const product = await productManager.getProductById(parseInt(req.params.pid));
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Producto no encontrado');
    }
});
router.post('/', async (req, res) => {
    const { title, description, code, price, stock, category, status = true } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ 
            error: 'Faltan campos obligatorios. Los campos requeridos son: title, description, code, price, stock, category.'
        });
    }
    const newProduct = {
        title,
        description,
        code,
        price,
        stock,
        category,
        status,
        thumbnails: req.body.thumbnails || []
    };
    const addedProduct = await productManager.addProduct(newProduct);
    if (addedProduct) {
        res.status(201).json(addedProduct);
    } else {
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
});
router.put('/:pid', async (req, res) => {
    const updatedProduct = req.body;
    const product = await productManager.updateProduct(parseInt(req.params.pid), updatedProduct);
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Producto no encontrado o error al actualizar');
    }
});
router.delete('/:pid', async (req, res) => {
    const success = await productManager.deleteProduct(parseInt(req.params.pid));
    if (success) {
        res.send('Producto eliminado');
    } else {
        res.status(404).send('Producto no encontrado o error al eliminar');
    }
});

module.exports = router;
