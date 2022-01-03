const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwt_secret = process.env.JWT_SECRET;

// middleware to check for the auth token present or not
const VerifyToken = (req, res, next) => {
    // get the authHeader

    const token = req.header('auth-token');
    if (token) {
        // verify token
        jwt.verify(token, jwt_secret, (err, user) => {
            if (err) {
                return res.status(403).json({ error: "please authenticate using a valid token" })
            }
            // assign our user that we got from the token to the original user
            req.user = user;
            next();
        })
    }
    else {
        return res.status(401).json({ error: "Token not authenticated" })

    }
}

// middleware to check auth token belongs to the user who is logged in or if user is admin
const verifyTokenAndAuthorization = (req, res, next) => {
    VerifyToken(req, res, () => {
        if (req.user._id === req.params.id || req.user.isAdmin) {
            next()
        } else {
            return res.status(403).json({ Unauthorized: "Cannot push changes" })
        }
    })
};

// middleware to check for if the loggedin user is admin or not 
const verifyTokenAndAdmin = (req, res, next) => {
    VerifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next()
        } else {
            return res.status(403).json({Unauthorized: "Admin rights not found "})
        }
    })
}

module.exports = { VerifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };