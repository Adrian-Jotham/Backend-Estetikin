const albumController = require('../controllers/album');
const articleController = require("../controllers/artikel.js");
const moduleController = require("../controllers/module.js");
const { isLoggedIn } = require('../controllers/auth');
const uploadController = require('../controllers/upload');
const upprofileController = require('../controllers/upprofile');
const profileController = require('../controllers/profile')
const express = require("express");
const router = express.Router();
router.get('/module',isLoggedIn,moduleController.getModules);
router.get('/album',isLoggedIn,albumController.album);
router.get('/article/:type',isLoggedIn,articleController.getArticle);
router.post('/upload', isLoggedIn, uploadController.uploadImage);
router.post('/uploadprofile', isLoggedIn, upprofileController.uploadprofile);
router.get('/profile', isLoggedIn, profileController.getProfile);
router.get('/protected',isLoggedIn,uploadController.protectedRoute);

module.exports = router;