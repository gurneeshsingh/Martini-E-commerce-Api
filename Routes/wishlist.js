const express = require('express');
const router = express.Router();
const { VerifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../Middleware/VerifyToken');
const Wishlist = require('../Models/WishlistSchema');

// api endpoint to create a wishlist , only login required
router.post('/', VerifyToken, async (req, res) => {
    let { userId, products } = req.body;
    try {
        const oldWishlist = await Wishlist.findOne({ userId: userId });
        if (!oldWishlist) {
            const newWishlist = new Wishlist(req.body);
            const saveWishlist = await newWishlist.save();
            res.status(201).json(saveWishlist)
        } else {
            // add product tto existing wihslist 
            const updatedProduct = await Wishlist.updateOne({ "_id": oldWishlist._id }, { $push: { "products": { $each: products } } })
            res.status(200).json(updatedProduct)
        }
    } catch (error) {
        res.status(500).json(error.message)
    }
});

// api endpoint to get user's cart , login and authorisation required

router.get('/find/:userId', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const wishlist = await Wishlist.find({ userId: req.params.userId });
        res.status(200).json(wishlist)
    } catch (error) {
        res.status(500).json(error)
    }
});

router.delete('/delete/:userId', verifyTokenAndAuthorization, async (req, res) => {
  
    const { productId } = req.body;
    try {
        const oldWishlist = await Wishlist.findOne({ userId: req.params.userId });
        if (!oldWishlist) {
            return res.status(403).json({Message:"UnAuthorised"})
        } else {
            const deletedProduct = await Wishlist.updateOne({ "_id": oldWishlist._id }, { $pull: { "products": { "_id": productId } } })
            res.status(200).json(deletedProduct)
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;
// 616431f7bce65c198245aefb