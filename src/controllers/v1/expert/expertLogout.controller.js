const express = require("express");
const Expert = require("../../../model/Expert");
const app = express();

const expertLogout = async (req, res) => {
        try {
            const UserID = req.expert.id;
            const token = req.cookies.expertRefreshToken;
            let expert = await Expert.findOne({ _id: UserID })
            if (expert == null) return res.status(403).json({
                message: "expert not found"
            })
            const newTokenList = await expert.activeToken.filter(tokens => tokens !== token)
            await Expert.updateOne({ _id: UserID }, { activeToken: newTokenList }).then(() => {
                res.clearCookie("refreshToken").status(200).json({
                    "message": "Expert logout successfull"
                });
            })
        }
        catch (err) {
            console.log(err);
        }
}

module.exports = expertLogout;