const express = require("express");
const User = require("../../../model/User");
const app = express();

const userLogout = async (req, res) => {
        try {
            const UserID = req.user.id;
            const token = req.cookies.userRefreshToken;
            let user = await User.findOne({ _id: UserID })
            if (user == null) return res.status(403).json({
                message: "user not found"
            })
            const newTokenList = await user.activeToken.filter(tokens => tokens !== token)
            await User.updateOne({ _id: UserID }, { activeToken: newTokenList }).then(() => {
                res.clearCookie("refreshToken").status(200).json({
                    "message": "User logout successfull"
                });
            })
        }
        catch (err) {
            console.log(err);
        }
}

module.exports = userLogout;