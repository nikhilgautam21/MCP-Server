const ComplaintSchema = require('../models/complaintSchema')
const mongoose = require("mongoose")
var Complaint = mongoose.model("Complaint", ComplaintSchema)

const addComplaintController = async (req, res, next) => {
    let complaint = req.body
    let id = req.user._id
    complaint["userid"] = id
    Complaint.create(complaint).then(function (data) {
        res.status(200).send(data)
    },err=>{
        res.json({
            msg: err,
            status: 401
        })
    })
}

const updateComplaintStatusController = async (req, res, next) => {
    let id = req.body.id
    let data = {"status":req.body.status}
    let options = {
        useFindAndModify: false,
        new: true
    }
    Complaint.findOneAndUpdate({ _id: id }, data, options).then(function (data) {
        res.status(200).send(data)
    })
}

const allComplaintsController = async (req, res, next) =>{
    Complaint.find().then(function (complaints){
        let data  = complaints.map(item=>{
            delete item["userid"]
            return item
        })
        res.send(data)
    })
}


module.exports = {
    addComplaintController,
    updateComplaintStatusController,
    allComplaintsController
}