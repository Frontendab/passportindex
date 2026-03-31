const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler")

const connect_mongodb = asyncHandler(async() => {
    mongoose.connect(
        process.env.DB_URL,
    );
    console.log("mongodb is connected...");
});

module.exports = connect_mongodb