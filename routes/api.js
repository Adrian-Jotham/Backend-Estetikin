const albumController = require('../controllers/album');
const articleController = require("../controllers/artikel.js");
const moduleController = require("../controllers/module.js");
const { isLoggedIn } = require('../controllers/auth');
const uploadController = require('../controllers/upload');
const express = require("express");
const router = express.Router();

router.get('/module',isLoggedIn,moduleController.getStories);
router.get('/album',isLoggedIn,albumController.album);
router.get('/:type',isLoggedIn,articleController.getArticle);
router.post('/upload', isLoggedIn, uploadController.uploadImage);
router.get('/protected',isLoggedIn,uploadController.protectedRoute);

module.exports = router;