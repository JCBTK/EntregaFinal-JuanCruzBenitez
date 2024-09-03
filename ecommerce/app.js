const express = require('express');
const app = express();
const path = require('path');
app.use(express.json());
app.use('/data/img', express.static(path.join(__dirname, 'data/img')));
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
