const request = require('request');
const User = require('../models/userSchema');


const googleAuthController = async (req, res, next) => {
    console.log("LOGIN", req.body)
    let token = req.body.googletoken
    request(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${token}`, { json: true }, async (err, resp, body) => {
        // console.log(resp.body,"Google")
        let user = await User.findOne({ google_id: resp.body.id })
        if (user) {
            const token = user.generateAuthToken();
            res.send({
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
                res.send({
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

module.exports = {
    googleAuthController,
    yahooController
}