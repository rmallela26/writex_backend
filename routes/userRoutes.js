const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const verifyJWT = require('../middleware/verifyJWT')

router.route('/')
    .get(verifyJWT, usersController.getUser)
    .post(usersController.createNewUser)
    .patch(verifyJWT, usersController.updateUser)
    // .delete(usersController.deleteUser)

router.route('/google-tokens')
    .post(verifyJWT, usersController.setTokens)

router.route('/google-access')
    .get(verifyJWT, usersController.getAccessToken)

router.route('/google-refresh')
    .get(verifyJWT, usersController.getRefreshToken)

module.exports = router