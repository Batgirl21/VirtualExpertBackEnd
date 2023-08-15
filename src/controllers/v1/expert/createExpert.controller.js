const express = require("express");
const Expert = require("../../../model/Expert");
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createExpert = async (req, res) => {
    try {
        expert = new Expert(req.body);
        const { email, mobile } = req.body;

        Expert.findOne({ $or: [{ email }, { mobile }] })
            .then(resp => {
                if (resp?.email === email) return res.status(400).json({ msg: "Email Already Exist" });
                if (resp?.mobile === mobile) return res.status(400).json({ msg: "Mobile Already Exist" });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(expert.password, salt, async (err, hash) => {
                        if (err) throw (err);
                        expert.password = hash;
                        await expert.save().then(() => {
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
                                            "message": "Expert Added successfull",
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

const genrateAcessToken = (expert) => {
    return jwt.sign({ id: expert._id }, process.env.EXPERT_JWT_SECRET, { expiresIn: '15m' })
}

module.exports = createExpert