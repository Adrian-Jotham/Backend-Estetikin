const express = require('express');
const userController = require('../controllers/app');
const { isLoggedIn } = require('../controllers/auth');

const router = express.Router();

router.post('/upload', isLoggedIn, userController.uploadImage);
router.get('/protected',isLoggedIn,userController.protectedRoute);
module.exports = router;