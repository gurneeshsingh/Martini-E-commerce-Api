const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_KEY);


// api endpoint for making payment through stripe

router.post('/payment', (req, res) => {
    // create a charge with some properties , that returns either a success or error , stripe generates a tokenid for a charge 

    stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "INR"
    }, (stripeErr, stripeRes) => {
        if (stripeErr) {
             res.status(500).json(stripeErr)
        } else {
            res.status(200).json(stripeRes)
        }
    })
})

module.exports = router;
