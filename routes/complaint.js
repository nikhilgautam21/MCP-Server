const express = require('express')
const router = express.Router();
const {addComplaintController} = require('../controllers/complaintController')
const {updateComplaintStatusController} = require('../controllers/complaintController')

router.post('/addpost', addComplaintController )
router.post('/updatestatus',updateComplaintStatusController)

module.exports = router