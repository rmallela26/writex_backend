const express = require('express')
const router = express.Router()
const path = require('path')
const collegesController = require('../controllers/collegesController')

router.route('/college-names')
    .get(collegesController.getCollegeNames)

router.route('/essays')
    .get(collegesController.getEssays)


module.exports = router