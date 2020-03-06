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
    let id = req.body.id
    let data = req.body.data
   // res.send("gsgsdg")
   let options ={
    useFindAndModify: false,
    new: true
   }
    Complaint.findOneAndUpdate({_id:id},data,options).then(function(data){
        console.log(data)
        res.send(data)
    })
}


module.exports = {
    addComplaintController,
    updateComplaintStatusController
}