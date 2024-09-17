const express = require('express');
const { create } = require('express-handlebars');
const { Server } = require('socket.io');
const http = require('http');
const path = require('path');
const ProductManager = require('./managers/ProductManager');
const CartManager = require('./managers/CartManager');
const productManager = new ProductManager('./data/productos.json');
const cartManager = new CartManager('./data/carrito.json');
const app = express();
const hbs = create({
    extname: '.handlebars',
    layoutsDir: false
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());

const productRouter = require('./routes/products');
const cartRouter = require('./routes/carts');
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

const server = http.createServer(app);
const io = new Server(server);

app.get('/home', (req, res) => {
    const products = productManager.getProducts();
    res.render('home', { products, layout: false });
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { layout: false });
});

io.on('connection', (socket) => {
    console.log('Cliente conectado');
    const products = productManager.getProducts();
    socket.emit('updateProducts', products);
    socket.on('addProduct', (product) => {
        productManager.addProduct(product);
        const updatedProducts = productManager.getProducts();
        io.emit('updateProducts', updatedProducts);
    });
    socket.on('deleteProduct', (pid) => {
        productManager.deleteProduct(pid);
        const updatedProducts = productManager.getProducts();
        io.emit('updateProducts', updatedProducts);
    });
});

app.use((req, res, next) => {
    res.status(404).json({ error: 'Ruta no existente' });
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
