const express = require('express');
const router = express.Router();
const CartManager = require('../managers/CartManager');
const cartManager = new CartManager('./data/carts.json');

router.post('/', (req, res) => {
    const newCart = cartManager.addCart();
    res.status(201).json(newCart);
});

router.get('/:cid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const cart = cartManager.getCartById(cartId);
    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(cart.products);
});

router.post('/:cid/product/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const cart = cartManager.addProductToCart(cartId, productId);
    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado o producto no encontrado' });
    }
    res.status(201).json(cart);
});

module.exports = router;
