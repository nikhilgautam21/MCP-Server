const ComplaintSchema = require('../models/complaintSchema')
const mongoose = require("mongoose")
var Complaint = mongoose.model("Complaint", ComplaintSchema)

const addComplaintController = async (req, res, next) => {
    let complaint = req.body
    Complaint.create(complaint).then(function (data) {
        res.send(data)
    })
}

const updateComplaintStatusController = async (req, res, next) => {
    console.log(req.body)
    let status = req.body.status
    let id = req.body.id
    res.send("gsgsdg")
    Complaint.findOneAndUpdate({_id:id},{status:status},(data)=>{
        res.send(data)
    })
}


module.exports = {
    addComplaintController,
    updateComplaintStatusController
}