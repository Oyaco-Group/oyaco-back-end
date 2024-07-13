const WarehouseService = require("../services/warehouseService");

class WarehouseController {
  static async getListWarehouse(req, res, next) {
    try {
      const warehouses = await WarehouseService.getListWarehouse();
      res.status(200).json({
        message: "success",
        status: 200,
        data: warehouses,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const { name, location } = req.body;
      const newWarehouse = await WarehouseService.create(name, location);
      res.status(200).json({
        message: "Successfully warehouse created",
        status: 200,
        data: newWarehouse,
      });
    } catch (error) {
      next(error);
    }
  }

  static async edit(req, res, next) {
    try {
      const { id } = req.params;
      const { name, location } = req.body;
      const updatedWarehouse = await WarehouseService.edit(id, name, location);
      res.status(200).json({
        message: "Successfully warehouse updated",
        status: 200,
        data: updatedWarehouse,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      await WarehouseService.delete(id);
      res.status(200).json({
        message: "Successfully warehouse deleted",
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = WarehouseController;
