const prisma = require("../lib/prisma");

class InventoryService {
  static async createStock(data) {
    const {
      master_product_id,
      warehouse_id,
      quantity,
      expiration_status,
      isdelete,
    } = data;

    const inventory = await prisma.inventory.create({
      data: {
        master_product_id,
        warehouse_id,
        quantity,
        expiration_status,
        isdelete,
      },
    });
    return inventory;
  }

  static async getAllStock(page) {
    const limit = 5;
    const skip = (page - 1) * limit;
    const inventory = await prisma.inventory.findMany({
      take: limit,
      skip: skip,
    });

    return inventory;
  }

  static async getStockById(id) {
    const inventory = await prisma.inventory.findUnique({
      where: { id: parseInt(id) },
    });

    if (!inventory) {
      throw { name: "notFound", message: "No stock found" };
    }

    return inventory;
  }

  static async getStockByWarehouse(id) {
    const inventory = await prisma.inventory.findMany({
      where: { warehouse_id: parseInt(id) },
    });

    return inventory;
  }

  static async sortHighest() {
    const data = await prisma.inventory.findMany();

    const sortHigh = (array) => {
      for (let i = 1; i < array.length; i++) {
        for (let j = 0; j < i; j++) {
          if (array[i].quantity > array[j].quantity) {
            const x = array[i];
            array[i] = array[j];
            array[j] = x;
          }
        }
      }
      return array;
    };
    const sortedInventory = sortHigh(data);
    return sortedInventory;
  }

  static async sortLowest() {
    const data = await prisma.inventory.findMany();

    const sortLow = (array) => {
      for (let i = 1; i < array.length; i++) {
        for (let j = 0; j < i; j++) {
          if (array[i].quantity < array[j].quantity) {
            const x = array[i];
            array[i] = array[j];
            array[j] = x;
          }
        }
      }
      return array;
    };
    const sortedInventory = sortLow(data);
    return sortedInventory;
  }

  static async editStock(params) {
    const {
      id,
      master_product_id,
      warehouse_id,
      quantity,
      expiration_status,
      isdelete,
    } = params;

    const invetoryExist = await prisma.inventory.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!invetoryExist) {
      throw { name: "failedToUpdate", message: "Edit failed" };
    }

    const inventory = await prisma.inventory.update({
      where: { id: parseInt(id) },
      data: {
        master_product_id: master_product_id,
        warehouse_id: warehouse_id,
        quantity: quantity,
        expiration_status: expiration_status,
        isdelete: isdelete,
      },
    });

    return inventory;
  }

  static async delete(id) {
    const inventory = await prisma.inventory.delete({
      where: { id: parseInt(id) },
    });

    const invetoryExist = await prisma.inventory.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!invetoryExist) {
      throw { name: "failedToDelete", message: "Delete failed" };
    }

    return inventory;
  }
}

module.exports = InventoryService;
