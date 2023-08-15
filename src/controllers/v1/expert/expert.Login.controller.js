const express = require("express");
const Expert = require("../../../model/Expert");
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

module.exports = async function expertLogin(req, res) {

    try {
        const { userID, password } = req.body;

        Expert.findOne({ $or: [{ email: userID }, { mobile: userID }] })
            .then(expert => {
                if (!expert) return res.status(400).json({ message: 'Expert Doesnot Exist' })
                bcrypt.compare(password, expert.password)
                    .then(isMatch => {
                        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' })
                        const accessToken = genrateAcessToken(expert)
                        jwt.sign(
                            { id: expert._id },
                            process.env.EXPERT_REFRESH_SECRET,
                            async (err, token) => {
                                if (err) throw err;
                                expert.activeToken = [...expert.activeToken, token]
                                await expert.save().then(() => {
                                    res.cookie("expertRefreshToken", token, {
                                        httpOnly: true,
                                        secure: false,
                                        expires: new Date(253402300000000)
                                    }).status(200).json({
                                        "message": "Expert Login successfull",
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
const genrateAcessToken = (expert) => {
    return jwt.sign({ id: expert._id }, process.env.EXPERT_JWT_SECRET, { expiresIn: '15m' })
}