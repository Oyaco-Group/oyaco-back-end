const prisma = require("../lib/prisma");

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
        arrival_date,
        expiration_date,
      } = data;

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
          const errorMessage = `Invalid origin input`;
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
            name: "exist",
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
            expiration_date,
          },
        });

        //Update inventory jika ada barang yang keluar
        await prisma.inventory.update({
          where: {
            id: originInventory.id,
          },
          data: {
            quantity: {
              decrement: quantity,
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
              expiration_status: false,
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
            expiration_date,
          },
        });

        //Update inventory jika ada barang yang masuk
        await prisma.inventory.update({
          where: {
            id: destinationInventory.id,
          },
          data: {
            quantity: {
              increment: quantity,
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
    const limit = 10;
    const skip = (page - 1) * limit;
    const productMovement = await prisma.productMovement.findMany({
      take: limit,
      skip: skip,
    });

    return productMovement;
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

  static async getTransactionsByWarehouseId(warehouseId) {
    const transactions = await prisma.productMovement.findMany({
      where: {
        inventory: {
          warehouse_id: parseInt(warehouseId)
        }
      },
      include: {
        inventory: true,  // Mengikutsertakan data inventory
        user: true,       // Mengikutsertakan data user
        master_product: true // Mengikutsertakan data master_product
      }
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
}

module.exports = TransactionService;
