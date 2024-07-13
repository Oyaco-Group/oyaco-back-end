const CategoryService = require("../services/categoryService.js");

class CategoriesController {
  static async getListCategories(req, res, next) {
    try {
      const categories = await CategoryService.getListCategories();
      res.status(200).json({
        message: "Success",
        status: 200,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const { name } = req.body;
      const newCategory = await CategoryService.create(name);
      res.status(200).json({
        message: "Successfully category created",
        status: 200,
        data: newCategory,
      });
    } catch (error) {
      next(error);
    }
  }

  static async edit(req, res, next) {
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
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      await CategoryService.delete(id);
      res.status(200).json({
        message: "Successfully category deleted",
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoriesController;
