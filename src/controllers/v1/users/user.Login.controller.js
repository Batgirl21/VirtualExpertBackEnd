const express = require("express");
const User = require("../../../model/User");
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

module.exports = async function userLogin(req, res) {

    try {
        const { userID, password } = req.body;

        User.findOne({ $or: [{ email: userID }, { mobile: userID }] })
            .then(user => {
                if (!user) return res.status(400).json({ message: 'User Doesnot Exist' })
                bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' })
                        const accessToken = genrateAcessToken(user)
                        jwt.sign(
                            { id: user._id },
                            process.env.USER_REFRESH_SECRET,
                            async (err, token) => {
                                if (err) throw err;
                                user.activeToken = [...user.activeToken, token]
                                await user.save().then(() => {
                                    res.cookie("userRefreshToken", token, {
                                        httpOnly: true,
                                        secure: false,
                                        expires: new Date(253402300000000)
                                    }).status(200).json({
                                        "message": "User Login successfull",
                                        token: accessToken
                                    });
                                })

                            }
                        )
                    })

            })

    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error in loging in");
    }
}
const genrateAcessToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.USER_JWT_SECRET, { expiresIn: '15m' })
}