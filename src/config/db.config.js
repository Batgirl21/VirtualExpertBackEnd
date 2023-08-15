const mongoose = require('mongoose');


const initiateDB = async () => {
    const uri = process.env.MONGO_URI;
    mongoose.connect(uri,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    mongoose.connection.once("open", () => {
        console.log("DB connect");
    });
    

}

module.exports = initiateDB;