const express = require('express')
const router = express.Router()
const path = require('path')
const collegesController = require('../controllers/collegesController')

router.route('/')
    .get(collegesController.getAllColleges)
    // .post(usersController.createNewUser)
    // .patch(usersController.updateUser)
    // .delete(usersController.deleteUser)

module.exports = router