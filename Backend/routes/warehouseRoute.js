const express = require("express");
const router = express.Router();
const WarehouseController = require("../controllers/warehouseController.js");

router.get("/", WarehouseController.getListWarehouse);
router.post("/add", WarehouseController.create);
router.put("/edit/:id", WarehouseController.edit);
router.delete("/delete/:id", WarehouseController.delete);

module.exports = router;
