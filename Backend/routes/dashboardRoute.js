const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const { authentication } = require("../middleware/auth");

const router = express.Router();

router.get("/", authentication, dashboardController.getDashboard);

module.exports = router;
