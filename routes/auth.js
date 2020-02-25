const express = require('express')
const router = express.Router();
const {googleAuthController} = require('../controllers/index')
const {googleAuthCallBackController} = require('../controllers/index')
const {yahooController} = require('../controllers/index')

router.get('/google', googleAuthController )
router.get('/google/callback',googleAuthCallBackController)
router.get('/yahoo', yahooController)

module.exports = router