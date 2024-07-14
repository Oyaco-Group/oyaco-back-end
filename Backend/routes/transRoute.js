const express = require("express");
const router = express.Router();
const TransController = require("../controllers/transController");

router.post("/create", TransController.createTrans);

module.exports = router;
