const google = require('../config/google_key.json')
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(google.web.client_id);

const googleAuthController = async (req, res, next) => {
    console.log(req.headers)
    const ticket = await client.verifyIdToken({
        idToken: req.headers.bearer,
        audience: google.web.client_id
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    res.send(userid)
}

const googleAuthCallBackController = async (req, res, next) => {

}

const yahooController = async (req,res,next) =>{
    res.send("YAHOOOOOOO")
}

module.exports = {
    googleAuthController,
    googleAuthCallBackController,
    yahooController
}