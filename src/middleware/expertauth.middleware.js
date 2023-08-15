const jwt = require('jsonwebtoken');
const Expert = require('../model/Expert')

const ExpertAuth = (req, res, next) => {
    const token = req.header('Expert-Authorization');
    //check for token
    if (!token) {
        res.status(401).json({
            message: 'no Token, Authorization Denied'
        })
    }

    try {
        // verify token
        const decoded = jwt.verify(token, process.env.EXPERT_JWT_SECRET)

        //Add User from payload
        Expert.findById(decoded.id)
            .then(expert => {
                if (expert == null) {
                    res.status(400).json({
                        "status": "auth_error"
                    });
                }
                else {
                    req.expert = decoded;
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
    ExpertAuth: ExpertAuth
}