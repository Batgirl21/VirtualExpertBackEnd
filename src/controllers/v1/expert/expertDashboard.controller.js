const express = require("express");
const Expert = require("../../../model/Expert");
const app = express();

module.exports = async function ExpertDashboard(req, res) {

    Expert.findById(req.expert.id)
        .select('-password')
        .then(expert => res.json(expert))

}