const mongoose = require('mongoose')
const Schema = mongoose.Schema

const complaintSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "username is required"]
    },
    phone:{
        type: Number,
        required: [true, "phone is required"]
    },
    address:{
        type: String,
        required:[true, "address is  required"]
    },
    date:{
        type: String,
        required: [true, "date is required"]
    },
    notes:{
        type: String,
        required: [true, "notes is required"]
    },
    status:{
        type: String,
        required:[true, "status is required"]
    },
    userId: {type: Schema.Types.ObjectId, ref: 'User'}
 
})

//const Complaint = mongoose.model('user', complaintSchema);
module.exports = complaintSchema;