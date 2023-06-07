const express = require("express");
const articleController = require("../controllers/artikel.js");
const { isLoggedIn } = require('../controllers/auth');
// const apiController = require('../controllers/app.js');
const router = express.Router();

router.get('/:type',isLoggedIn,articleController.getArticle);


module.exports = router;