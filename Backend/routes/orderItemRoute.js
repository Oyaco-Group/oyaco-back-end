const express = require("express");
const router = express.Router();
const OrderItemController = require("../controllers/orderItemController");

router.post("/createorderitem", OrderItemController.createOrder);
router.get("/getorderitem", OrderItemController.getOrder);
router.get("/getoneorderitem/:id", OrderItemController.getOneOrder);
router.put("/updateorderitem/:id", OrderItemController.updateOrder);
router.delete("/deleteorderitem/:id", OrderItemController.deleteOrder);

module.exports = router;
