const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../Models/UserSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// api endpoint to create a user /register , no login required

const jwt_secret = process.env.JWT_SECRET;

router.post('/register', [
    body('username', 'Name should be minimum 3 letters').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 4 letters').isLength({ min: 4 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    //destructure body
    let { username, email, password, cpassword } = req.body;
    try {
        // find user already registered
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" })
        } else if ((password !== cpassword)) {
            // check if passwords match 
            return res.status(400).json({ error: "Passwords dont match" })
        } else {
            // create salt 
            const salt = await bcrypt.genSalt(10);
            //hash password and cpassword
            password = await bcrypt.hash(password, salt);
            cpassword = await bcrypt.hash(cpassword, salt);
            // create user with hashed passwords
            const newUser = new User({ username, email, password, cpassword });
            //save user to db
            const createdUser = await newUser.save();
            if (createdUser) {
                res.status(201).json({ message: "User Registered" })
            }
        }
    } catch (error) {
        res.status(500).send(error)
    }
});


// api endpoint to login user and create jwt token 

router.post('/login', [
    body('email', 'Please enter a valid email').isEmail(),
    body('password', 'Please enter a correct password').exists()
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        // destructure body
        const { email, password } = req.body;
        try {
            // find user with email
            let existingUser = await User.findOne({ email: email });
            if (!existingUser) {
                return res.status(400).json({ error: "please login with proper credentials" })
            }
            // compare password entered with passwored stored in db
            const passwordComapre = await bcrypt.compare(password, existingUser.password);
            if (!passwordComapre) {
                return res.status(401).json({ error: "Please login with proper credentials" })
            }

            // if password match send id of the user stored in db to generate auth token from jwt 
            // generate auth token
            const authToken = jwt.sign({
                id: existingUser._id,
                isAdmin: existingUser.isAdmin
            },
                jwt_secret,
                { expiresIn: '2d' });

            res.status(200).json({ authToken: authToken, id: existingUser._id, username:existingUser.username, isAdmin:existingUser.isAdmin})

        } catch (error) {
            res.status(500).send("Internal server error")
        }
    })

module.exports = router;

