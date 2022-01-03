const express = require('express');
const router = express.Router();
const { VerifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../Middleware/VerifyToken');
const Order = require('../Models/OrderSchema');

// api endpoint to  create order , only login required

router.post('/', VerifyToken, async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        res.status(201).send(savedOrder)
    } catch (error) {
        res.status(500).json(error)
    }
});

// api endpoint to update order , only admin required

router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        res.status(200).json(updatedOrder)
    } catch (error) {
        res.status(500).json(error)
    }
});


// api endpoint to delete own's cart , only admin

router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Order deleted" })
    } catch (error) {
        res.status(500).json(error)
    }
});

// api endpoin to get User's orders , login and authorisation

router.get('/find/:userId', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId })
        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json(error)
    }
});


// api endpoint to get all orders , only admin 

router.get('/', verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const orders = query ? await Order.find().sort({ _id: -1 }).limit(8) : await Order.find();
        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json(error)
    }
});

router.get('/income', verifyTokenAndAdmin, async (req, res) => {
    const currentMonth = new Date();
    const lastMonth = new Date(currentMonth.setMonth(currentMonth.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount"
                }

            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" }
                }
            }
        ])
        res.status(200).json(income)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;

