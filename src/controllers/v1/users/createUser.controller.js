const express = require("express");
const User = require("../../../model/User");
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
    try {
        user = new User(req.body);
        const { email, mobile } = req.body;

        User.findOne({ $or: [{ email }, { mobile }] })
            .then(resp => {
                if (resp?.email === email) return res.status(400).json({ msg: "Email Already Exist" });
                if (resp?.mobile === mobile) return res.status(400).json({ msg: "Mobile Already Exist" });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(user.password, salt, async (err, hash) => {
                        if (err) throw (err);
                        user.password = hash;
                        await user.save().then(() => {
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
                                            "message": "User Added successfull",
                                            token: accessToken
                                        });
                                    })

                                }
                            )
                        });
                    })
                })
            });



    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error in Saving");
    }
}

const genrateAcessToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.USER_JWT_SECRET, { expiresIn: '15m' })
}

module.exports = createUser