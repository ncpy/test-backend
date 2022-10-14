const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
    {
        uid:    { type: String },
        name:   { type: String },
        email:  { type: String },
        token:  { type: String },
        roles:  { type: Array },
    },
    { timestamps:true }
)

module.exports = mongoose.model("User", UserSchema)