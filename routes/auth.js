const express = require("express");
const authController = require("../controllers/auth.js");

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgetpassword', authController.forgetpassword);
router.post('/checkreset', authController.checkReset);
router.get('/logout', authController.logout);
router.get('/test', authController.logout);

module.exports = router;