const express = require('express');
const uploadController = require('../controllers/upload');
const { isLoggedIn } = require('../controllers/auth');

const router = express.Router();

router.post('/upload', isLoggedIn, uploadController.uploadImage);
router.get('/protected',isLoggedIn,uploadController.protectedRoute);
module.exports = router;