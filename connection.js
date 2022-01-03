// mongodb connection here

const mongoose = require('mongoose');
require('dotenv').config();

const mongoUrl = process.env.MONGO_URL

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Connection to mongoDB successfull')
}).catch((err) => {
    console.log(err);
})


