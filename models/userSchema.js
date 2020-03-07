const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    google_id:{
        type:String
    },
    name:{
        type: String,
        required: [true, "username is required"]
    },
    email:{
        type: String,
        required: [true, "email is required"]
    },
    role:{
        type: String,
        required: [true, "role is required"]
    }
})

const User = mongoose.model('user',userSchema);
module.exports = User;