const express = require('express')
const router = express.Router();
const {googleAuthController} = require('../controllers/authController')
const {yahooController} = require('../controllers/authController')

router.post('/google', googleAuthController )
router.get('/yahoo', yahooController)

module.exports = router