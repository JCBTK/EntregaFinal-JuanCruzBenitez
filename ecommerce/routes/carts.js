const express = require('express');
const router = express.Router();
const CartManager = require('../managers/cartManager');
const cartManager = new CartManager('./data/carrito.json');

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
    const populatedCart = {
        ...cart,
        products: cart.products.map(prodId => productManager.getProductById(prodId))
    };
    res.json(populatedCart);
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

router.put('/:cid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const updatedProducts = req.body.products;
    const cart = cartManager.updateCart(cartId, updatedProducts);
    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(cart);
});

router.put('/:cid/products/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const { quantity } = req.body;
    const cart = cartManager.updateProductQuantity(cartId, productId, quantity);
    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado o producto no encontrado' });
    }
    res.json(cart);
});

router.delete('/:cid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    cartManager.clearCart(cartId);
    res.status(204).send();
});

module.exports = router;
