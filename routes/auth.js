const express = require('express')
const router = express.Router();
const {googleAuthController} = require('../controllers/authController')
const {yahooController, adminAuthController, createAdminController} = require('../controllers/authController')

router.post('/google', googleAuthController )
router.get('/yahoo', yahooController)
router.post('/admin', adminAuthController)
router.post('/createadmin', createAdminController)

module.exports = router