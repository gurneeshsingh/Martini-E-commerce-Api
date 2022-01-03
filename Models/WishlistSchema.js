const mongoose = require('mongoose');


const WishlistSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    products: [
        {
            productId: {
                type: String
            },

            brand: {
                type: String,
                required: true
            },
            title: {
                type: String,
                required: true,
                unique: true
            },
            img: {
                type: String,
                required: true
            },

            price: {
                type: Number,
                required: true
            }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', WishlistSchema);