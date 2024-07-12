const prisma = require("../lib/prisma");

class WarehouseService {
  static async getListWarehouse() {
    try {
      return await prisma.warehouse.findMany({
        where: { isdelete: false },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async create(name, location) {
    try {
      return await prisma.warehouse.create({
        data: {
          name: name,
          location: location,
          isdelete: false,
        },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async edit(id, name, location) {
    try {
      return await prisma.warehouse.update({
        where: { id: parseInt(id) },
        data: {
          name: name,
          location: location,
        },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async delete(id) {
    try {
      return await prisma.warehouse.update({
        where: { id: parseInt(id) },
        data: { isdelete: true },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = WarehouseService;
