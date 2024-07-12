const express = require("express");
const router = express.Router();
const authRoute = require('./authRoute.js')
const orderRoute = require('./orderRoute.js')
const {authentication, authorization} = require("../middleware/auth.js");

router.use("/api/auth", authRoute);
//router.use(authentication)
router.use("/api/order", orderRoute);


module.exports = router;
