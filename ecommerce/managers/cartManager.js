const fs = require('fs');

class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    getCarts() {
        const data = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(data);
    }

    getCartById(id) {
        const carts = this.getCarts();
        return carts.find(c => c.id === id);
    }

    addCart() {
        const carts = this.getCarts();
        const newCart = { id: carts.length + 1, products: [] };
        carts.push(newCart);
        this.saveCarts(carts);
        return newCart;
    }

    addProductToCart(cartId, productId) {
        const carts = this.getCarts();
        const cart = this.getCartById(cartId);
        if (!cart) return null;
        
        const productInCart = cart.products.find(p => p.product === productId);
        if (productInCart) {
            productInCart.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }
        this.saveCarts(carts);
        return cart;
    }

    saveCarts(carts) {
        fs.writeFileSync(this.filePath, JSON.stringify(carts, null, 2));
    }
}

module.exports = CartManager;
