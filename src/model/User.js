const mongoose = require('mongoose');

const User = mongoose.Schema({
    email:{
        type:String,
        required: true,
        unique: true
    },
    password: {
        type:String,
        required: true,
    },
    mobile: {
        type:String,
        required: true,
    },
    name:{
        type:String,
        required: true,
    },
    address:{
        type:String,
        required: true,
    },
    activeToken: []
},
    { timestamps: true }
);


module.exports = mongoose.model("User", User);