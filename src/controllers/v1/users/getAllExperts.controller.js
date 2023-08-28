const express = require("express");
const Expert = require("../../../model/Expert");
const app = express();

const getAllExperts = async (req, res) => {
        try {
            Expert.find() .select('-password').then(expert => res.json(expert))
        }   
        catch (err) {
            console.log(err);
        }
}

module.exports = getAllExperts;