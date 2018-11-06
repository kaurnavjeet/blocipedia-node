const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.post("/users/signup", userController.signup);

module.exports = router;
