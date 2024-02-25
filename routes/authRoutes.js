const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const loginLimiter = require('../middleware/loginLimiter')

router.route('/') //login 
    .post(loginLimiter, authController.login)

router.route('/refresh') //refresh token
    .get(authController.refresh)

router.route('/logout')
    .post(authController.logout)

router.route('/google')
    .post(authController.googleLogin)

router.route('/google-refresh')
    .post(authController.googleRefresh)

module.exports = router