const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const verifyJWT = require('../middleware/verifyJWT')

router.route('/')
    .get(verifyJWT, usersController.getUser)
    .post(usersController.createNewUser)
    // .delete(usersController.deleteUser)

router.route('/activities')
    .get(verifyJWT, usersController.getUserActivities)
    .post(verifyJWT, usersController.addUserActivities)

router.route('/add')
    .patch(verifyJWT, usersController.updateUser)

router.route('/delete')
    .patch(verifyJWT, usersController.updateUserDelete)

router.route('/google-tokens')
    .post(verifyJWT, usersController.setTokens)

router.route('/google-access')
    .get(verifyJWT, usersController.getAccessToken)

router.route('/google-refresh')
    .get(verifyJWT, usersController.getRefreshToken)

module.exports = router