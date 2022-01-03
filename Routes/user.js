const express = require('express');
const router = express.Router();
const {  verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../Middleware/VerifyToken');
const User = require('../Models/UserSchema');
const bcrypt = require('bcrypt');



// api endpoint to get details of  a user , login required, admin rights required

router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {

    try {
        const user = await User.findById(req.params.id).select("-password -cpassword")
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json(error)
    }

});


// api endpoint to get details of all users , login and admin rights required

router.get('/', verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const users = query? await User.find().sort({_id: -1}).limit(5).select("-password -cpassword") : await User.find().select("-password -cpassword");
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json(error)
    }
})


// api endpoint to update user details , login required 

router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    // if user updates the password , we need to encryppt it again 
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt)
        }
        // update the user
        const updateduser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true }).select("-password -cpassword")
        res.status(201).json(updateduser)
    } catch (error) {
        res.status(500).json(error)
    }

});

// api endpoint to delete user 

router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted" })
    } catch (error) {
        res.status(500).json(error)
    }
})


module.exports = router;

