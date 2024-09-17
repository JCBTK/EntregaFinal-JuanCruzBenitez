const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    getProducts() {
        const data = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(data);
    }

    getProductById(id) {
        const products = this.getProducts();
        return products.find(p => p.id === id);
    }

    addProduct(product) {
        const products = this.getProducts();
        product.id = products.length + 1;
        products.push(product);
        this.saveProducts(products);
    }

    updateProduct(id, newProductData) {
        const products = this.getProducts();
        const productIndex = products.findIndex(p => p.id === id);
        if (productIndex === -1) return null;
        products[productIndex] = { ...products[productIndex], ...newProductData };
        this.saveProducts(products);
        return products[productIndex];
    }

    deleteProduct(id) {
        let products = this.getProducts();
        products = products.filter(p => p.id !== id);
        this.saveProducts(products);
    }

    saveProducts(products) {
        fs.writeFileSync(this.filePath, JSON.stringify(products, null, 2));
    }
}

module.exports = ProductManager;
