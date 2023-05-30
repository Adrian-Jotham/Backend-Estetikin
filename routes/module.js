const express = require("express");
const moduleController = require("../controllers/module.js");
// const apiController = require('../controllers/app.js');
const router = express.Router();

router.get('/module', moduleController.getStories);


module.exports = router;