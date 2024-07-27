const express = require("express");
const path = require("path");
const router = express.Router();
const authRoute = require("./authRoute.js");
const userRoute = require("./userRoute.js");
const orderRoute = require("./orderRoute.js");
const orderItemRoute = require("./orderItemRoute.js");
const { authentication, authorization } = require("../middleware/auth.js");
const masterProductRoutes = require("./masterProductRoute.js");
const categoryRoutes = require("./categoryRoute.js");
const warehouseRoutes = require("./warehouseRoute.js");
const inventoryRoutes = require("./inventoryRoute.js");
const transactionsRoutes = require("./transactionRoute.js");
const complaintRoutes = require("./complaintRoute.js");

router.use("/api/auth", authRoute);
// router.use(authentication);
router.use(
  "/api/images",
  express.static(path.join(__dirname, "../assets/masterProduct"))
);
router.use(
  "/api/images",
  express.static(path.join(__dirname, "../assets/user"))
);
router.use("/api/user", userRoute);
router.use("/api/order", orderRoute);
router.use("/api/masterProduct", masterProductRoutes);
router.use("/api/orderitem", orderItemRoute);
router.use("/api/categories", categoryRoutes);
router.use("/api/warehouses", warehouseRoutes);
router.use("/api/inventory", inventoryRoutes);
router.use("/api/transactions", transactionsRoutes);
router.use("/api/complaint", complaintRoutes);

module.exports = router;
