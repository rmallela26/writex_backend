const express = require('express')
const router = express.Router()
const path = require('path')
const essaysController = require('../controllers/essaysController')

router.route('/')
    .get(essaysController.getEssays)

module.exports = router