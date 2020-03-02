const request = require('request');
const User = require('../models/userSchema');
const Complaint = require('../models/complaintSchema')

const googleAuthController = async (req, res, next) => {
    let token = req.headers.bearer
    request(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${token}`, { json: true }, (err, resp, body) => {
        User.create({
            google_id:resp.body.id,
            name:resp.body.name,
            email:resp.body.email,
            role:"user"
        }).then(function(data){
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
    }, err => {
        res.json({
            status: 400,
            msg: "Can't authorize"
        })
    })

}

const addComplaintController = async (req, res, next) => {
    let complaint = req.body
    Complaint.create(complaint).then(function(data){
        res.send(data)
    })
}

const yahooController = async (req, res, next) => {
    res.send("YAHOOOOOOO")
}

module.exports = {
    googleAuthController,
    googleAuthCallBackController,
    yahooController
}