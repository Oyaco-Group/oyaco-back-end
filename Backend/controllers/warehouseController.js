const WarehouseService = require("../services/warehouseService.js");

class WarehouseController {
  static async getListWarehouse(req, res) {
    try {
      const warehouses = await WarehouseService.getListWarehouse();
      res.status(200).json({
        message: "success",
        status: 200,
        data: warehouses,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error retrieving warehouses",
        status: 500,
        error: error.message,
      });
    }
  }

  static async create(req, res) {
    try {
      const { name, location } = req.body;
      const newWarehouse = await WarehouseService.create(name, location);
      res.status(200).json({
        message: "Successfully warehouse created",
        status: 200,
        data: newWarehouse,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error creating warehouse",
        status: 500,
        error: error.message,
      });
    }
  }

  static async edit(req, res) {
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
      console.error(error);
      res.status(500).json({
        message: "Error updating warehouse",
        status: 500,
        error: error.message,
      });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await WarehouseService.delete(id);
      res.status(200).json({
        message: "Successfully warehouse deleted",
        status: 200,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error deleting warehouse",
        status: 500,
        error: error.message,
      });
    }
  }
}

module.exports = WarehouseController;
