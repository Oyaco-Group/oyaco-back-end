const express = require("express");
const router = express.Router();
const ComplainntController = require("../controllers/complaintController");

router.get("/", ComplainntController.getListComplaint);
router.get("/:order_id", ComplainntController.getOneComplaint);
router.post("/add", ComplainntController.createComplaint);
router.patch("/edit/:order_id", ComplainntController.editComplaint);
router.delete("/delete/:order_id", ComplainntController.deleteComplaint);
module.exports = router;
