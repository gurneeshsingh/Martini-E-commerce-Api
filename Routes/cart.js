const express = require('express');
const router = express.Router();
const { VerifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../Middleware/VerifyToken');
const Cart = require('../Models/CartSchema');

// api endpoint to  create cart , only login required

router.post('/', VerifyToken, async (req, res) => {
    try {
        const newCart = new Cart(req.body);
        const savedCart = await newCart.save();
        res.status(201).send(savedCart)
    } catch (error) {
        res.status(500).json(error)
    }
});

// api endpoint to update cart , login and authorisation required

router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        res.status(200).json(updatedCart)
    } catch (error) {
        res.status(500).json(error)
    }
});


// api endpoint to delete own's cart , login and authorization required

router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Cart deleted" })
    } catch (error) {
        res.status(500).json(error)
    }
});

// api endpoin to get User's cart , login and authorisation

router.get('/find/:userId', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId })
        res.status(200).json(cart)
    } catch (error) {
        res.status(500).json(error)
    }
});


// api endpoint to get all carts , only admin 

router.get('/', verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;

