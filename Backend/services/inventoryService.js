const prisma = require("../lib/prisma");

class InventoryService {
  static async createStock(data) {
    const { master_product_id, warehouse_id, quantity, isdelete } = data;

    const isdeleteBoolean = isdelete === true;

    const existingInventory = await prisma.inventory.findFirst({
      where: {
        AND: [
          { warehouse_id: +warehouse_id },
          { master_product_id: +master_product_id },
        ],
      },
    });
    if (existingInventory) {
      throw {
        name: "failedToCreate",
        message: "Inventory is Already Exist, Please Check Inventory List",
      };
    }
    const inventory = await prisma.inventory.create({
      data: {
        master_product_id: +master_product_id,
        warehouse_id: +warehouse_id,
        quantity: +quantity,
        isdelete: isdeleteBoolean,
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

  static async getStockByWarehouse(warehouse_id, page) {
    const limit = 5;
    const skip = (page - 1) * limit;

    const inventory = await prisma.inventory.findMany({
      where: { warehouse_id: parseInt(warehouse_id) },
      take: limit,
      skip: skip,
      include: {
        master_product: {
          select: {
            name: true,
            price: true,
          },
        },
      },
    });

    return inventory;
  }

  static async getStockByProductId(params) {
    const inventory = await prisma.inventory.findMany({
      where : {
        master_product_id : +params
      },
      include : {
        warehouse : true
      }
    })
    if(!inventory) throw({name : 'notFound', message : 'Inventory is Not Found'});
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
    const { id, master_product_id, warehouse_id, quantity, isdelete } = params;

    const invetoryExist = await prisma.inventory.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!invetoryExist) {
      throw { name: "failedToUpdate", message: "Edit failed" };
    }

    const checkInventory = await prisma.inventory.findFirst({
      where: {
        AND: [
          { warehouse_id: +warehouse_id },
          { master_product_id: +master_product_id },
        ],
      },
    });

    if (+warehouse_id !== +invetoryExist.warehouse_id) {
      if (checkInventory)
        throw {
          name: "failedToUpdate",
          message: "Inventory is Already Exist, Please Check Inventory List",
        };
    }
    // if (+master_product_id !== +invetoryExist.master_product_id) {
    //   if (checkInventory)
    //     throw {
    //       name: "failedToUpdate",
    //       message: "Inventory is Already Exist, Please Check Inventory List",
    //     };
    // }

    const inventory = await prisma.inventory.update({
      where: { id: parseInt(id) },
      data: {
        master_product_id: master_product_id,
        warehouse_id: warehouse_id,
        quantity: quantity,
        isdelete: isdelete,
      },
    });

    return inventory;
  }

  static async delete(id) {
    const invetoryExist = await prisma.inventory.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!invetoryExist) {
      throw { name: "failedToDelete", message: "Delete failed" };
    }
    const inventory = await prisma.inventory.delete({
      where: { id: parseInt(id) },
    });

    return inventory;
  }
}

module.exports = InventoryService;
