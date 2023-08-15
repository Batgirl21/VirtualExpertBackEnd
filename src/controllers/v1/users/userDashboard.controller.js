const express = require("express");
const User = require("../../../model/User");
const app = express();

module.exports = async function UserDashboard(req, res) {

    User.findById(req.user.id)
        .select('-password')
        .then(user => res.json(user))

}