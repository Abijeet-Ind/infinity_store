const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

router.get('/get-all-users', authController.protect, authController.getAllProductData);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/forgetPassword', authController.forgetPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updatePassword', authController.protect, authController.updateUserPassword);

module.exports = router;