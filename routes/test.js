const express = require('express');
const router = express.Router();
const testController = require("../controllers/test.controller");

router.post('/drop', testController.dropTables);

module.exports = router;
