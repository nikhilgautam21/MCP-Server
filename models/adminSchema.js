const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const secret = require('../config/jwt.json')

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, "username is required"]
    },
    password: {
        type: String,
        required: [true, "password is required"]
    }
})

adminSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id}, secret.secretkey);
    return token;
}

const User = mongoose.model('admin', adminSchema);
module.exports = User;