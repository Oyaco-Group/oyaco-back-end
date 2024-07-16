const prisma = require("../lib/prisma");

class TransService {
  //Membuat transaction untuk dimasukkan ke productMovement
  //1 kali fungsi ini bisa langsung update dan create inventory
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
}

module.exports = TransService;
