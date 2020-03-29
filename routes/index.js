const express = require('express')
const router = express.Router();


router.get('/home', function(req,res,err){
    res.send("Hello ghjsdalkgjsdkgj")
})

module.exports = router; 