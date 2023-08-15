const jwt = require('jsonwebtoken');
const User = require('../model/User')

const UserAuth = (req, res, next) => {
    const token = req.header('User-Authorization');
    //check for token
    if (!token) {
        res.status(401).json({
            message: 'no Token, Authorization Denied'
        })
    }

    try {
        // verify token
        const decoded = jwt.verify(token, process.env.USER_JWT_SECRET)

        //Add User from payload
        User.findById(decoded.id)
            .then(user => {
                if (user == null) {
                    res.status(400).json({
                        "status": "auth_error"
                    });
                }
                else {
                    req.user = decoded;
                    next();
                }
            })

    } catch (e) {
        console.log(e.message);
        res.status(400).json({
            message: "token is not valid"
        })

    }
}

module.exports = {
    UserAuth: UserAuth
}