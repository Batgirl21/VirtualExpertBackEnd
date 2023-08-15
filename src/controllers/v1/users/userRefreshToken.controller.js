const express = require("express");
const User = require("../../../model/User");
const jwt = require("jsonwebtoken");    

module.exports = async function refreshToken(req, res) {
    try {
        const RefreshToken = req.cookies.userRefreshToken
        if (RefreshToken == null) return res.status(401).send("No token");
        jwt.verify(RefreshToken, process.env.USER_REFRESH_SECRET, (err, user) => {
            if (err) return res.status(403).send("Auth Error");
            User.findOne({ _id: user.id }).then(data => {
                if (data == null) return res.status(403).send("forbiden");
                if (!data.activeToken.includes(req.cookies.userRefreshToken)) return res.status(403).send("forbiden");
                const accesstoken = jwt.sign({ id: user.id }, process.env.USER_JWT_SECRET, { expiresIn: '15m' })
                res.status(200).json({ token: accesstoken })
            })
        })
    } catch (err) {
        console.log(err.message);
        res.status(403).send("Auth Error");
    }
}