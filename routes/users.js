const express = require('express');
const router = express.Router();
const authController = require("../controllers/auth.controller");

const { checkDuplicateUsernameOrEmail } = require("../middlewares/verifySignUp");

router.post('/signup', [checkDuplicateUsernameOrEmail], authController.signup);
router.post("/signin", authController.signin);
router.post("/signout", authController.signout);

module.exports = router;
