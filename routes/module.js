const express = require("express");
const moduleController = require("../controllers/module.js");
// const apiController = require('../controllers/app.js');
const { isLoggedIn } = require('../controllers/auth');
const router = express.Router();

router.get('/module',isLoggedIn,moduleController.getStories);


module.exports = router;