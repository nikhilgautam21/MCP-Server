const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const secret = require('../config/jwt.json')
const userSchema = new mongoose.Schema({
    google_id: {
        type: String
    },
    name: {
        type: String,
        required: [true, "username is required"]
    },
    email: {
        type: String,
        required: [true, "email is required"]
    },
    role: {
        type: String,
        required: [true, "role is required"]
    }
})

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, google_id: this.google_id }, secret.secretkey);
    return token;
}

const User = mongoose.model('user', userSchema);
module.exports = User;