const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL,{

        useNewUrlParser: true,
        useUnifiedTopology : true
    })
    .then( () => console.log("DB Connectd Successfully"))
    .catch( (error) => {
        console.log(process.env.MONGODB_URL)
        console.log("DB Connection Failed");
        console.error(error.message);
        process.exit(1);
    })
}