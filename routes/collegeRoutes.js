const express = require('express')
const router = express.Router()
const collegesController = require('../controllers/collegesController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/college-names')
    .get(collegesController.getCollegeNames)

router.route('/essays')
    .get(collegesController.getEssays)


module.exports = router