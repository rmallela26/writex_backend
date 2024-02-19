const express = require('express')
const router = express.Router()
const path = require('path')
const singleCollegeController = require('../controllers/singleCollegeController')

router.route('/')
    .get(singleCollegeController.getCollege)
    // .post(usersController.createNewUser)
    // .patch(usersController.updateUser)
    // .delete(usersController.deleteUser)

module.exports = router