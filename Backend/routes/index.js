const express = require("express");
const router = express.Router();
const authRoute = require("./authRoute.js");
const orderRoute = require("./orderRoute.js");
const orderItemRoute = require("./orderItemRoute.js")
const { authentication, authorization } = require("../middleware/auth.js");
const masterProductRoutes = require('./masterProductRoute.js');
const categoryRoutes = require("./categoryRoute.js");
const warehouseRoutes = require("./warehouseRoute.js");

router.use("/api/auth", authRoute);
//router.use(authentication)
router.use("/api/order", orderRoute);
router.use("/api/masterProduct",masterProductRoutes);
router.use("/api/orderitem", orderItemRoute);
router.use("/api/categories", categoryRoutes);
router.use("/api/warehouses", warehouseRoutes);

module.exports = router;