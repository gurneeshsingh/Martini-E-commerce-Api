const express = require('express');
const router = express.Router();
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../Middleware/VerifyToken');
const Product = require('../Models/ProductSchema');


// api endpoint to add a product to db , login and admin rights required

router.post('/addproduct', verifyTokenAndAdmin, async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        if (savedProduct) {
            res.status(201).json({
                message: "Product Added",
                product: savedProduct
            })
        }

    } catch (error) {
        res.status(500).json(error)
    }

});


// api endpoint to update product details , login and admin rights required

router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        res.status(200).json({
            message: "Product details Updated",
            product: updatedProduct
        })
    } catch (error) {
        res.status(500).json(error)
    }
});

// api endpoint to delete rpoduct , login and admin required

router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Product deleted" })
    } catch (error) {
        res.status(500).json(error)
    }
})


// api endpoint to get details of a single product , no login required , anyone can see the detials of product


router.get('/find/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json(error)
    }
});


// api endpoint to view all products and pass queries to view filtered products, no login required

router.get('/', async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products;
        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(2);

        } else if (qCategory) {
            products = await Product.find({ categories: { $in: [qCategory] } })
        } else {
            products = await Product.find()
        }
        res.status(200).json(products)

    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;

