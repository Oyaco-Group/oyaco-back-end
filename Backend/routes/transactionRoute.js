const express = require("express");
const router = express.Router();
const TransController = require("../controllers/transactionController");

router.get("/expirationcheck", TransController.expirationCheck);
router.get("/", TransController.getAllTransactions);
router.get("/outgoingTransactions",TransController.getAllOutgoingTransactions);
router.get("/incomingTransactions",TransController.getAllIncomingTransactions);
router.get("/outgoing/:warehouseId",TransController.getOutgoingTransactionsByWarehouseId);
router.get("/incoming/:warehouseId",TransController.getIncomingTransactionsByWarehouseId);
router.get("/sort/highest", TransController.sortHighest);
router.get("/sort/lowest", TransController.sortLowest);
router.post("/", TransController.createTrans);
router.put("/expStatus", TransController.updateExpirationStatus);
router.delete("/:id", TransController.delete);

module.exports = router;
