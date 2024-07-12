const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/orderController");

router.post("/createorder", OrderController.createOrder);
router.get("/getorder", OrderController.getOrder);
router.get("/getoneorder/:id", OrderController.getOneOrder);

module.exports = router;
