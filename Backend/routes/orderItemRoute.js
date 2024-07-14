const express = require("express");
const router = express.Router();
const OrderItemController = require("../controllers/orderItemController");

router.post("/createorderitem", OrderItemController.createOrderItem);
router.get("/getorderitem", OrderItemController.getOrderItem);
router.get("/getoneorderitem/:order_id", OrderItemController.getOneOrderItem);
router.put("/updateorderitem/:id", OrderItemController.updateOrderItem);
router.delete("/deleteorderitem/:id", OrderItemController.deleteOrderItem);

module.exports = router;
