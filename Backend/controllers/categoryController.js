const CategoryService = require("../services/categoryService.js");

class CategoriesController {
  static async getListCategories(req, res) {
    try {
      const categories = await CategoryService.getListCategories();
      res.status(200).json({
        message: "Success",
        status: 200,
        data: categories,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error retrieving categories",
        status: 500,
        error: error.message,
      });
    }
  }

  static async create(req, res) {
    try {
      const { name } = req.body;
      const newCategory = await CategoryService.create(name);
      res.status(200).json({
        message: "Successfully category created",
        status: 200,
        data: newCategory,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error creating category",
        status: 500,
        error: error.message,
      });
    }
  }

  static async edit(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const updatedCategory = await CategoryService.edit(id, name);
      res.status(200).json({
        message: "Successfully category updated",
        status: 200,
        data: updatedCategory,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error updating category",
        status: 500,
        error: error.message,
      });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await CategoryService.delete(id);
      res.status(200).json({
        message: "Successfully category deleted",
        status: 200,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error deleting category",
        status: 500,
        error: error.message,
      });
    }
  }
}

module.exports = CategoriesController;
