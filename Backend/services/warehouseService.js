const prisma = require("../lib/prisma");

class WarehouseService {
  static async getListWarehouse() {
    const warehouses = await prisma.warehouse.findMany({
      where: { isdelete: false },
    });
    if (!warehouses)
      throw {
        name: "failedToRetrieve",
        message: "Failed to retrieve warehouses",
      };
    return warehouses;
  }

  static async create(name, location) {
    const newWarehouse = await prisma.warehouse.create({
      data: {
        name: name,
        location: location,
        isdelete: false,
      },
    });
    if (!newWarehouse)
      throw { name: "failedToCreate", message: "Failed to create warehouse" };
    return newWarehouse;
  }

  static async edit(id, name, location) {
    const existingWarehouse = await prisma.warehouse.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingWarehouse)
      throw {
        name: "failedToUpdate",
        message: "Update is failed, no existing warehouse",
      };

    const updatedWarehouse = await prisma.warehouse.update({
      where: { id: parseInt(id) },
      data: {
        name: name,
        location: location,
      },
    });
    if (!updatedWarehouse)
      throw { name: "failedToUpdate", message: "Failed to update warehouse" };
    return updatedWarehouse;
  }

  static async delete(id) {
    const existingWarehouse = await prisma.warehouse.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingWarehouse)
      throw {
        name: "failedToDelete",
        message: "Delete is failed, no existing warehouse",
      };

    const deletedWarehouse = await prisma.warehouse.update({
      where: { id: parseInt(id) },
      data: { isdelete: true },
    });
    if (!deletedWarehouse)
      throw { name: "failedToDelete", message: "Failed to delete warehouse" };
    return deletedWarehouse;
  }
}

module.exports = WarehouseService;
