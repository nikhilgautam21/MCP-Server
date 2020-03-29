const ComplaintSchema = require('../models/complaintSchema')
const mongoose = require("mongoose")
var Complaint = mongoose.model("Complaint", ComplaintSchema)
const AWS = require('aws-sdk');
const fs = require('fs');
const images = require("../config/image.json")
require('dotenv').config();

const addComplaintController = async (req, res, next) => {
    let complaint = req.body
    let id = req.user._id
    complaint["userid"] = id
    let number;
    // Getting latest Complaint Number
    Complaint.findOne({}, {}, { sort: { 'createdAt': -1 } }, function (err, data) {
        if (data != null) {
            number = data.complaint_number
        }
        else {
            number = 0;
        }
        complaint["complaint_number"] = Number(number) + 1;

        Complaint.create(complaint).then((data) => {
             res.status(200).send(data)
        }, err => {
            res.json({
                msg: err,
                status: 401
            })
        })
    });
}

const uploadComplaintPicsController = async (req,res,next) => {
    let images = req.body.images
    let complaint_id = req.body.complaint_id

    let images_url = []

    AWS.config.update({
        accessKeyId: process.env.access_key,
        secretAccessKey: process.env.secret_key,
        region: process.env.region
    })
    images.forEach((image,index) => {

        const base64 = image
        const base64Data = new Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        const type = base64.split(';')[0].split('/')[1];
        const imageRemoteName = `MCP_Complaint_${complaint_id}_${new Date().getTime()}.jpeg`

        var s3 = new AWS.S3();

        const params = {
            Bucket: process.env.bucket_name,
            Key: imageRemoteName, // type is not required
            Body: base64Data,
            ACL: 'public-read',
            ContentEncoding: 'base64', // required
            ContentType: `image/${type}`
        }
            s3.upload(params,function(err, data){
                images_url.push(data.Location)
                if(index == images.length-1){
                    //res.send(images_url);
                    let data = { "images": images_url}
                    Complaint.findOneAndUpdate({ _id: complaint_id }, data, {useFindAndModify: false,new: true, strict: false}).then(function (data) {
                        res.status(200).send(data)
                    })
                }
            })
    })
}


const updateComplaintStatusController = async (req, res, next) => {
    let id = req.body.id
    let data = { "status": req.body.status }
    let options = {
        useFindAndModify: false,
        new: true
    }
    Complaint.findOneAndUpdate({ _id: id }, data, options).then(function (data) {
        res.status(200).send(data)
    })
}

const allComplaintsController = async (req, res, next) => {
    Complaint.find().then(function (complaints) {
        let data = complaints.map(item => {
            delete item["userid"]
            return item
        })
        res.send(data)
    })
}


module.exports = {
    addComplaintController,
    updateComplaintStatusController,
    allComplaintsController,
    uploadComplaintPicsController
}