const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const verifyJWT = require('../middleware/verifyJWT')

router.route('/')
    .get(verifyJWT, usersController.getUser)
    .post(usersController.createNewUser)
    .patch(verifyJWT, usersController.updateUser)
    // .delete(usersController.deleteUser)

module.exports = router