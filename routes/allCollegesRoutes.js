const express = require('express')
const router = express.Router()
const path = require('path')
const allCollegesController = require('../controllers/allCollegesController')

router.route('/')
    .get(allCollegesController.getColleges)

module.exports = router