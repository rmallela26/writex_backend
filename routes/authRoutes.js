const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const loginLimiter = require('../middleware/loginLimiter')
const verifyJWT = require('../middleware/verifyJWT')

router.route('/') //login 
    .post(loginLimiter, authController.login)

router.route('/refresh') //refresh token
    .get(authController.refresh)

router.route('/logout')
    .post(authController.logout)

router.route('/google')
    .post(verifyJWT, authController.googleLogin)

router.route('/google-refresh')
    .post(verifyJWT, authController.googleRefresh)

module.exports = router