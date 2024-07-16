const InventoryService = require("../services/inventoryService");

class InventoryController {
  static async createStock(req, res, next) {
    try {
      const {
        master_product_id,
        warehouse_id,
        quantity,
        expiration_status,
        isdelete,
      } = req.body;

      const inventory = await InventoryService.createStock({
        master_product_id,
        warehouse_id,
        quantity,
        expiration_status,
        isdelete,
      });

      res.status(200).json({
        data: inventory,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getAllStock(req, res, next) {
    try {
      const page = req.query.page;
      const inventory = await InventoryService.getAllStock(page);

      res.status(200).json({
        massage: "success get all stock",
        data: inventory,
      });
    } catch (err) {
      next(err);
    }
  }

  static async sortHighest(req, res, next) {
    try {
      const stockHigh = await InventoryService.sortHighest();
      res.status(200).json({
        message: "Sorted by highest quantity",
        data: stockHigh,
      });
    } catch (err) {
      next(err);
    }
  }

  static async sortLowest(req, res, next) {
    try {
      const stockLow = await InventoryService.sortLowest();
      res.status(200).json({
        message: "Sorted by lowest quantity",
        data: stockLow,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getStockById(req, res, next) {
    try {
      const { id } = req.params;

      const inventory = await InventoryService.getStockById(id);

      res.status(200).json({
        message: "success get stock",
        data: inventory,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getStockByWarehouse(req, res, next) {
    try {
      const { id } = req.params;

      const inventory = await InventoryService.getStockByWarehouse(id);

      res.status(200).json({
        message: "success get stock",
        data: inventory,
      });
    } catch (err) {
      next(err);
    }
  }

  static async editStock(req, res, next) {
    try {
      const { id } = req.params;
      const {
        master_product_id,
        warehouse_id,
        quantity,
        expiration_status,
        isdelete,
      } = req.body;

      const editStock = await InventoryService.editStock({
        id,
        master_product_id,
        warehouse_id,
        quantity,
        expiration_status,
        isdelete,
      });

      res.status(200).json({
        message: "Stock updated",
        status: 200,
        data: editStock,
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const inventory = await InventoryService.delete(id);

      res.status(200).json({
        message: "Stock deleted",
        data: inventory,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = InventoryController;
