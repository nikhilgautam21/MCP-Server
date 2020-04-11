const ComplaintSchema = require('../models/complaintSchema')
const mongoose = require("mongoose")
var Complaint = mongoose.model("Complaint", ComplaintSchema)
const User = require('../models/userSchema');
const AWS = require('aws-sdk');
var nodemailer = require('nodemailer');

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
    Complaint.findOneAndUpdate({ _id: id }, data, options).then(function (updatedData) {
        let userid = updatedData["userid"]
        let ObjectId = require('mongoose').Types.ObjectId; 
        let query ={_id : new ObjectId(userid) }
        User.find(query).then(function(user){
            sendMail(user[0]["email"],updatedData);
        })
        res.status(200).send(updatedData)

    })
}

const userComplaintsController = async (req, res, next) => {
   let userid  = req.user._id
   let ObjectId = require('mongoose').Types.ObjectId; 
   let query ={userid : new ObjectId(userid) }
    Complaint.find(query).then(function (complaints) {
        let data = complaints.map(item => {
            delete item["userid"]
            return item
        })
        res.send(data)
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

 const sendMail = (email, complaint) =>{
    var transporter = nodemailer.createTransport({
        host: process.env.smtp_host,
        auth: {
          user: process.env.smtp_email,
          pass: process.env.smtp_pass
        }
      });
      var mailOptions = {
        from: process.env.smtp_email,
        to: email,
        subject: 'Complaint Status Changed',
        text: `Your complaint number ${complaint.complaint_number} has been changed to ${complaint.status}`
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
 }
 


module.exports = {
    addComplaintController,
    updateComplaintStatusController,
    userComplaintsController,
    uploadComplaintPicsController,
    allComplaintsController
}