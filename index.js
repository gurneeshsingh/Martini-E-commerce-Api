const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
require('./connection');

//middleware
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3005

app.use('/api/auth', require('./Routes/auth'));
app.use('/api/cart', require('./Routes/cart'));
app.use('/api/order', require('./Routes/order'));
app.use('/api/product', require('./Routes/product'));
app.use('/api/user', require('./Routes/user'));
app.use('/api/checkout', require('./Routes/checkout'));
app.use('/api/wishlist', require('./Routes/wishlist'));


app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
})