const express = require("express");
const router = express.Router();
const CategoriesController = require("../controllers/categoryController.js");

router.get("/", CategoriesController.getListCategories);
router.post("/add", CategoriesController.create);
router.put("/edit/:id", CategoriesController.edit);
router.delete("/delete/:id", CategoriesController.delete);
module.exports = router;
