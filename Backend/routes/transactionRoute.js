const express = require("express");
const router = express.Router();
const TransController = require("../controllers/transactionController");

router.post("/", TransController.createTrans);

module.exports = router;
