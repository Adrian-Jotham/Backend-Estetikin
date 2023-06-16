const express = require("express");
const tester = require('../controllers/landingtest.js');
const router = express.Router();

router.get('/', tester.landing);

module.exports = router;