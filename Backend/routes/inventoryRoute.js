const express = require("express");
const router = express.Router();
const InventoryController = require("../controllers/inventoryController.js");

router.get("/stock", InventoryController.getAllStock);
router.get("/stock/:id", InventoryController.getStockById);
router.get("/highest", InventoryController.sortHighest);
router.get("/lowest", InventoryController.sortLowest);
router.get("/warestock/:id", InventoryController.getStockByWarehouse);
router.get("/product/:id", InventoryController.getStockByProductId)
router.post("/create", InventoryController.createStock);
router.put("/edit/:id", InventoryController.editStock);
router.delete("/stock/:id", InventoryController.delete);

module.exports = router;
