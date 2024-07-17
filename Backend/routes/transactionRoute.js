const express = require("express");
const router = express.Router();
const TransController = require("../controllers/transactionController");

router.get("/", TransController.getAllTransactions);
router.get("/:id", TransController.getTransactionById);
router.get("/sort/highest", TransController.sortHighest);
router.get("/sort/lowest", TransController.sortLowest);
router.post("/", TransController.createTrans);

module.exports = router;
