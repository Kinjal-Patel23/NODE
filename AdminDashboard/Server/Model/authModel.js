const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
    username : String,
    email : String,
    password : String,
    googleId : String,
    otp : Number,
    otpExpire : Number,
    role : {
        type : String,
        enum : ["user", "admin", "superadmin"],
        default : "user"
    }
});

const authModel = mongoose.model("users", authSchema);

module.exports = authModel