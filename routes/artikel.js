const express = require("express");
const articleController = require("../controllers/artikel.js");
// const apiController = require('../controllers/app.js');
const router = express.Router();

router.get('/:type', articleController.getArticle);


module.exports = router;