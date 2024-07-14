const express = require("express");
const router = express.Router();
const ProductMovementController = require("../controllers/productMovementController.js");

router.get("/productMovement", ProductMovementController.getListProductMovement);
router.get("/productMovement/:id", ProductMovementController.getProductMovementById);
router.post("/createproductMovement",ProductMovementController.createProductMovement);
router.put("/editproductMovement/:id", ProductMovementController.editProductMovement);
router.delete("/deleteproductMovement/:id", ProductMovementController.deleteProductMovement);

module.exports = router;