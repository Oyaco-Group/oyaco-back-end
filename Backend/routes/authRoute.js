const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const { uploadHandlerUser } = require("../lib/uploadImage");

router.post(
  "/register",
  uploadHandlerUser.single("image"),
  AuthController.register
);
router.post("/login", AuthController.login);

module.exports = router;
