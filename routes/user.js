const express = require('express')
const router = express.Router();
const {getUserController} = require('../controllers/userController')
const auth = require('../middlewares/auth')

router.get('/current', auth, getUserController)

module.exports = router;