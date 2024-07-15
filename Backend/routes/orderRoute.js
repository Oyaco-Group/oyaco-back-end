const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/orderController");

router.post("/createorder", OrderController.createOrder);
router.get("/getorder", OrderController.getOrder);
router.get("/getoneorder/:id", OrderController.getOneOrder);
router.put("/updateorder/:id", OrderController.updateOrder);
router.patch("/updateorderstatus/:id", OrderController.updateOrderStatus);
router.delete("/deleteorder/:id", OrderController.deleteOrder);

module.exports = router;
