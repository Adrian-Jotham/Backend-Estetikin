const redirController = require('../controllers/redirpass');
const express = require("express");
const router = express.Router();
router.get('/redirpass',redirController.getRedirect);
module.exports = router;