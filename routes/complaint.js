const express = require('express')
const router = express.Router();
const {addComplaintController} = require('../controllers/complaintController')
const {updateComplaintStatusController} = require('../controllers/complaintController')
const {allComplaintsController} = require('../controllers/complaintController')
const auth = require('../middlewares/auth')

router.post('/add', auth, addComplaintController )
router.post('/updatestatus',auth,updateComplaintStatusController)
router.get('/all-complaints', allComplaintsController)

module.exports = router