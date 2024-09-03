const fs = require('fs');
const path = './data/productos.json';

class ProductManager {
    constructor() {
        this.path = path;
    }
    getAllProducts = async () => {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al leer los productos:', error);
            return [];
        }
    }
    getProductById = async (id) => {
        const products = await this.getAllProducts();
        return products.find(product => product.id === id);
    }
    addProduct = async (product) => {
        const products = await this.getAllProducts();
        product.id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
        products.push(product);
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
            return product;
        } catch (error) {
            console.error('Error al agregar el producto:', error);
            return null;
        }
    }
    updateProduct = async (id, updatedProduct) => {
        let products = await this.getAllProducts();
        const index = products.findIndex(product => product.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...updatedProduct, id };
            try {
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
                return products[index];
            } catch (error) {
                console.error('Error al actualizar el producto:', error);
                return null;
            }
        } else {
            return null;
        }
    }
    deleteProduct = async (id) => {
        let products = await this.getAllProducts();
        const filteredProducts = products.filter(product => product.id !== id);
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(filteredProducts, null, 2));
            return true;
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            return false;
        }
    }
}

module.exports = ProductManager;
