const prisma = require("../lib/prisma");
const {sendEmailToAdmin} = require("../lib/nodeMailer");
const { response } = require("express");

class TransactionService {
  //Membuat transaction untuk dimasukkan ke productMovement
  //1 kali fungsi ini bisa langsung update dan/atau create inventory
  static async createTrans(data) {
    return prisma.$transaction(async (prisma) => {
      const {
        user_id,
        master_product_id,
        inventory_id,
        origin,
        destination,
        quantity,
        iscondition_good,
        arrival_date, // input arrival_date tetap ada
        expiration_date, // input expiration_date tetap ada
        expiration_status,
      } = data;

      if (!quantity || isNaN(quantity)) {
        const errorMessage = `Invalid quantity input`;
        throw { name: "invalidInput", message: errorMessage };
    }

      // Calculate expiration date if not provided
      const arrivalDate = new Date();
      const calculatedExpirationDate = new Date(
        arrivalDate.setMonth(arrivalDate.getMonth() + 3)
      );

      //Mencari product yang ada di masterProduct
      const masterProduct = await prisma.masterProduct.findFirst({
        where: { id: master_product_id },
      });

      //Validasi ada atau tidaknya product dengan master_product_id tertentu
      if (!masterProduct) {
        const errorMessage = `Product with master_product_id ${master_product_id} does not exist`;
        throw { name: "notFound", message: errorMessage };
      }

      let originWarehouseId = null;
      let productMovementOut = null;
      let productMovementIn = null;

      //Validasi apakah input adalah "Supplier" atau bukan
      if (origin !== "Supplier") {
        const originWarehouse = await prisma.warehouse.findFirst({
          where: { name: origin },
        });

        //Validasi apakah origin bisa di input atau tidak
        //origin yang bisa diinput: "Warehouse 1", "Warehouse 2", "Warehouse 3", "Supplier"
        if (!originWarehouse) {
          const errorMessage = "Invalid origin input";
          throw { name: "invalidInput", message: errorMessage };
        }

        originWarehouseId = originWarehouse.id;

        //Mencari product dengan input tertentu
        let originInventory = await prisma.inventory.findFirst({
          where: {
            master_product_id: master_product_id,
            warehouse_id: originWarehouseId,
          },
        });

        //Mencari product dengan master_product_id yang ditulis dan mengirim error jika tidak ada
        if (!originInventory) {
          const errorMessage = `Cannot find product with master_product_id ${master_product_id} in warehouse ${originWarehouseId}`;
          throw {
            name: "notFound",
            message: errorMessage,
          };
        }

        //Validasi jika quantity sebuah product kurang untuk dikeluarkan/"Out"
        if (originInventory.quantity < quantity) {
          const errorMessage = `Not enough stock for product with master_product_id ${master_product_id} in warehouse ${originWarehouseId}`;
          throw {
            name: "notFound",
            message: errorMessage,
          };
        }

        //Membuat record transaksi keluar
        productMovementOut = await prisma.productMovement.create({
          data: {
            user_id,
            master_product_id,
            inventory_id: originInventory.id,
            movement_type: "Out",
            origin,
            destination,
            quantity,
            iscondition_good,
            arrival_date,
            expiration_date: expiration_date || calculatedExpirationDate, // expiration_date otomatis dihitung jika tidak diberikan
            expiration_status,
          },
        });

        //Update inventory jika ada barang yang keluar
        await prisma.inventory.update({
          where: {
            id: originInventory.id,
          },
          data: {
            quantity: {
              decrement: parseInt(quantity),
            },
            isdelete: originInventory.quantity - quantity <= 0 ? true : false,
          },
        });
      }

      //Validasi apakah destination adalah "Customer"
      if (destination !== "Customer") {
        const destinationWarehouse = await prisma.warehouse.findFirst({
          where: { name: destination },
        });

        //Validasi apakah destination bisa diinput atau tidak
        //Destination yang bisa diinput: "Warehouse 1", "Warehouse 2", "Warehouse 3", "Customer"
        if (!destinationWarehouse) {
          const errorMessage = `Destination ${destination} does not exist`;
          throw {
            name: "notFound",
            message: errorMessage,
          };
        }

        const destinationWarehouseId = destinationWarehouse.id;

        //Mencari product dengan input sesuai
        let destinationInventory = await prisma.inventory.findFirst({
          where: {
            master_product_id: master_product_id,
            warehouse_id: destinationWarehouseId,
          },
        });

        //Jika tidak sesuai tapi master_product_id tersedia akan melakukan create di warehouse tujuan
        if (!destinationInventory) {
          destinationInventory = await prisma.inventory.create({
            data: {
              master_product_id: master_product_id,
              warehouse_id: destinationWarehouseId,
              quantity: 0,
              isdelete: false,
            },
          });
        }

        //Membuat record transaksi masuk
        productMovementIn = await prisma.productMovement.create({
          data: {
            user_id,
            master_product_id,
            inventory_id: destinationInventory.id,
            movement_type: "In",
            origin,
            destination,
            quantity,
            iscondition_good,
            arrival_date,
            expiration_date: expiration_date || calculatedExpirationDate, // expiration_date otomatis dihitung jika tidak diberikan
            expiration_status,
          },
        });

        //Update inventory jika ada barang yang masuk
        await prisma.inventory.update({
          where: {
            id: destinationInventory.id,
          },
          data: {
            quantity: {
              increment: parseInt(quantity),
            },
            isdelete: false,
          },
        });
      }

      return {
        productMovementOut: origin === "Supplier" ? null : productMovementOut,
        productMovementIn,
      };
    });
  }

  static async getAllTransactions(page) {
    const limit = 5;
    const skip = (page - 1) * limit;
    const productMovement = await prisma.productMovement.findMany({
      take: limit,
      skip: skip,
    });

    return productMovement;
  }

  static async updateExpirationStatus() {
    const currentDate = new Date();

    // Fetch expired products
    const expiredProducts = await prisma.productMovement.findMany({
      where: {
        expiration_date: {
          lte: currentDate,
        },
        expiration_status: false,
      },
    });

    if (expiredProducts.length === 0) {
      const errorMessage = "There are no more expired products";
      throw { name: "notFound", message: errorMessage }; // Exit if no expired products are found
    }

    // Track updates to avoid multiple updates for the same inventory
    const inventoryUpdates = new Map();

    for (const product of expiredProducts) {
      // Update expiration status for productMovement
      await prisma.productMovement.update({
        where: {
          id: product.id,
        },
        data: {
          expiration_status: true,
        },
      });

      // Find inventory record
      const inventory = await prisma.inventory.findUnique({
        where: {
          id: product.inventory_id,
        },
      });

      if (inventory) {
        const existingUpdate = inventoryUpdates.get(inventory.id) || {
          quantityToDecrement: 0,
          isdelete: false,
        };

        // Update the map with new values
        const quantityToDecrement =
          existingUpdate.quantityToDecrement + product.quantity;

        inventoryUpdates.set(inventory.id, {
          quantityToDecrement,
          isdelete: quantityToDecrement >= inventory.quantity,
        });

        // Create productMovement record for expired products
        await prisma.productMovement.create({
          data: {
            user_id: product.user_id,
            master_product_id: product.master_product_id,
            inventory_id: inventory.id,
            movement_type: "Out",
            origin: product.destination,
            destination: null,
            quantity: product.quantity,
            iscondition_good: product.iscondition_good,
            arrival_date: product.arrival_date,
            expiration_date: product.expiration_date,
            expiration_status: true,
          },
        });
      }
    }

    // Apply updates to inventory
    for (const [inventoryId, update] of inventoryUpdates.entries()) {
      const inventory = await prisma.inventory.findUnique({
        where: {
          id: inventoryId,
        },
      });

      if (inventory) {
        // Calculate the quantity to decrement
        const quantityToDecrement = Math.min(
          update.quantityToDecrement,
          inventory.quantity
        );

        // Update the inventory record
        await prisma.inventory.update({
          where: {
            id: inventoryId,
          },
          data: {
            quantity: {
              decrement: quantityToDecrement, // Ensure quantity doesn't go below zero
            },
            isdelete: update.isdelete,
          },
        });
      }
    }
  }

  static async getTransactionById(id) {
    const productMovement = await prisma.productMovement.findUnique({
      where: { id: parseInt(id) },
    });

    if (!productMovement) {
      throw { name: "notFound", message: "Transaction not found" };
    }

    return productMovement;
  }

  static async getOutgoingTransactionsByWarehouseId(warehouseId, page) {
    const limit = 5;
    const skip = (page - 1) * limit;

    const transactions = await prisma.productMovement.findMany({
      where: {
        AND: [
          {
            inventory: {
              warehouse_id: parseInt(warehouseId),
            },
          },
          {
            movement_type: {
              mode: "insensitive",
              equals: "Out",
            },
          },
        ],
      },
      include: {
        inventory: true,
        user: true,
        master_product: true,
      },
      take: limit,
      skip: skip,
    });

    return transactions;
  }

  static async getIncomingTransactionsByWarehouseId(warehouseId, page) {
    const limit = 5;
    const skip = (page - 1) * limit;
    
    const transactions = await prisma.productMovement.findMany({
      where: {
        AND: [
          {
            inventory: {
              warehouse_id: parseInt(warehouseId),
            },
          },
          {
            movement_type: {
              mode: "insensitive",
              equals: "In",
            },
          },
        ],
      },
      include: {
        inventory: true,
        user: true,
        master_product: true,
      },
      take: limit,
      skip: skip,
    });

    return transactions;
  }

  static async sortHighest() {
    const data = await prisma.productMovement.findMany();

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
    const sortedTransactions = sortHigh(data);
    return sortedTransactions;
  }

  static async sortLowest() {
    const data = await prisma.productMovement.findMany();

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
    const sortedTransactions = sortLow(data);
    return sortedTransactions;
  }

  static async delete(id) {
    const productMovementExist = await prisma.productMovement.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!productMovementExist) {
      throw { name: "failedToDelete", message: "Delete failed" };
    }
    const productMovement = await prisma.productMovement.delete({
      where: { id: parseInt(id) },
    });

    return productMovement;
  }

  static async expirationCheck() {
    let expiredProducts = [];
    // cron.schedule(
    //   "0 0 * * *",
    //   async () => {
        try {
          const today = new Date();
          expiredProducts = await prisma.productMovement.findMany({
            where: {
              expiration_date: {
                lt: today,
              },
              expiration_status: false,
            },
          });

          console.log("Checking expired products.");

          if (expiredProducts.length > 0) {
            await sendEmailToAdmin(expiredProducts);
          }else {
            console.log("No expired products found.");
          }
          
        } catch (error) {
          console.error("Failed checking expired products:", error);
        }
    //   },
    //   {
    //     scheduled: true,
    //     timezone: "Asia/Jakarta",
    //   }
    // );
  }
}

module.exports = TransactionService;
