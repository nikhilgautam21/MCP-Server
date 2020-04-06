const request = require('request');
const User = require('../models/userSchema');
const bcrypt = require('bcryptjs');
const Admin = require('../models/adminSchema');

const googleAuthController = async (req, res, next) => {
    let token = req.body.googletoken
    request(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${token}`, { json: true }, async (err, resp, body) => {
        let user = await User.findOne({ google_id: resp.body.id })
        if (user) {
            const token = user.generateAuthToken();
            res.json({
                "user": {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                "x-auth-token": token
            });
        }
        else {
            User.create({
                google_id: resp.body.id,
                name: resp.body.name,
                email: resp.body.email,
                role: "user"
            }).then(function (data) {
                const token = data.generateAuthToken();
                res.json({
                    "user": {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    },
                    "x-auth-token": token
                });
            }).catch((err) => {
                res.send(err)
            })
        }

    }, err => {
        res.json({
            status: 400,
            msg: "Can't authorize google access token"
        })
    })

}

const yahooController = async (req, res, next) => {
    res.send("YAHOOO")
}

const adminAuthController = async (req,res,next) =>{
    if(req.body.username && req.body.password){
        let admin  = await Admin.findOne({username:req.body.username})
        if(admin){
            bcrypt.compare(req.body.password,admin.password, function(err,compareResult){
                if(err){
                    res.json({ "message":err})
                }
                if(compareResult){
                    let token  = admin.generateAuthToken();
                    let user = {"username":admin.username}
                    res.json({"success":true,"x-auth-token":token,"admin":user})
                }else{
                    res.json({"success":false,"message":"Invalid Password"})
                } 
            })
        }else{
            res.json({
                "success": false,
                "messsage":"No admin exist with this username"
            })
        }
    }else{
        res.json({
            "success":false,
            "message": "Please send username and password"
        })
    }
}

const createAdminController = async (req,res,next) =>{
    console.log("CreateAdmin",req.body)
    if(req.body.username && req.body.password){
        let hash = await bcrypt.hash(req.body.password, 10)
        let admin = {
            username:  req.body.username,
            password: hash
        }
        Admin.create(admin).then(function(data){
            res.json(data)
        }).catch(function(err){
            -res.json(err)
        })
    }else{
        res.json({
            "message": "Please provide username and password"
        })
    }
}

module.exports = {
    googleAuthController,
    yahooController,
    adminAuthController,
    createAdminController
}