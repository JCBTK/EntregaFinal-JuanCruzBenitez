const express = require('express');
const router = express.Router();
const CartManager = require('../cartManager');
const ProductManager = require('../productManager');
const cartManager = new CartManager();
const productManager = new ProductManager();

router.get('/:cid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const cart = await cartManager.getCartById(cartId);
    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    const cartProducts = await Promise.all(cart.products.map(async (item) => {
        const product = await productManager.getProductById(item.product);
        return {
            product: {
                id: product.id,
                title: product.title,
                price: product.price,
            },
            quantity: item.quantity
        };
    }));
    res.json({
        id: cart.id,
        products: cartProducts
    });
});

module.exports = router;
