const fs = require('fs');
const path = './data/carrito.json';

class CartManager {
    constructor() {
        this.path = path;
    }
    getAllCarts = async () => {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al leer los carritos:', error);
            return [];
        }
    }
    getCartById = async (id) => {
        const carts = await this.getAllCarts();
        return carts.find(cart => cart.id === id);
    }
    addCart = async () => {
        const carts = await this.getAllCarts();
        const newCart = {
            id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
            products: []
        };
        carts.push(newCart);
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
            return newCart;
        } catch (error) {
            console.error('Error al agregar el carrito:', error);
            return null;
        }
    }
    addProductToCart = async (cartId, productId) => {
        const carts = await this.getAllCarts();
        const cartIndex = carts.findIndex(cart => cart.id === cartId);
        if (cartIndex !== -1) {
            const existingProduct = carts[cartIndex].products.find(p => p.product === productId);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                carts[cartIndex].products.push({ product: productId, quantity: 1 });
            }
            try {
                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
                return carts[cartIndex];
            } catch (error) {
                console.error('Error al agregar producto al carrito:', error);
                return null;
            }
        } else {
            return null;
        }
    }
}

module.exports = CartManager;
