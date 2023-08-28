const express = require("express");
const Expert = require("../../../model/Expert");
const jwt = require("jsonwebtoken");    

module.exports = async function refreshToken(req, res) {
    try {
        const RefreshToken = req.cookies.expertRefreshToken
        if (RefreshToken == null) return res.status(401).send("No token");
        jwt.verify(RefreshToken, process.env.EXPERT_REFRESH_SECRET, (err, expert) => {
            if (err) return res.status(403).send("Auth Error");
            Expert.findOne({ _id: expert.id }).then(data => {
                if (data == null) return res.status(403).send("forbiden");
                if (!data.activeToken.includes(req.cookies.expertRefreshToken)) return res.status(403).send("forbiden");
                const accesstoken = jwt.sign({ id: expert.id }, process.env.EXPERT_JWT_SECRET, { expiresIn: '15m' })
                res.status(200).json({ token: accesstoken })
            })
        })
    } catch (err) {
        console.log(err.message);
        res.status(403).send("Auth Error");
    }
}