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
    Complaint.findOne({}, {}, { sort: { 'created_at': 1 } }, function (err, data) {
        if (data != null) {
            number = data.complaint_number
        }
        else {
            number = 0;
        }
        complaint["complaint_number"] = Number(number) + 1;

        Complaint.create(complaint).then((data) => {
            // let images_url = await uploadPics(complaint["images"], data._id)
            // console.log(images_url, "images_url")
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
    images.forEach(async (image) => {

        // const base64 = image
        // const base64Data = new Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        //const type = base64.split(';')[0].split('/')[1];
        const imageRemoteName = `MCP_Complaint_${new Date().getTime()}.jpeg`

        var s3 = new AWS.S3();

        const params = {
            Bucket: process.env.bucket_name,
            Key: imageRemoteName,
            Body: image.name[0],
            ACL: 'public-read',
            ContentType: `image/jpeg`
        }

        let location = ''
        let key = ''
        try {
            const { Location, Key } = await s3.upload(params).promise();
            location = Location;
            key = Key
            images_url.push(location)
        } catch (e) {
            console.log(e)
        }

        //console.log(location, key)
    })
    res.send(images_url);
}


// const lastComplaintNumber = () => {
// }


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