const prisma = require("../lib/prisma");

class TransService {
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

      const masterProduct = await prisma.masterProduct.findFirst({
        where: { id: master_product_id },
      });

      if (!masterProduct) {
        const errorMessage = `Product with master_product_id ${master_product_id} does not exist`;
        throw { name: "notFound", message: errorMessage };
      }

      let originWarehouseId = null;
      let productMovementOut = null;
      let productMovementIn = null;

      if (origin !== "Supplier") {
        const originWarehouse = await prisma.warehouse.findFirst({
          where: { name: origin },
        });

        if (!originWarehouse) {
          const errorMessage = `Invalid origin input`;
          throw { name: "invalidInput", message: errorMessage };
        }

        originWarehouseId = originWarehouse.id;

        let originInventory = await prisma.inventory.findFirst({
          where: {
            master_product_id: master_product_id,
            warehouse_id: originWarehouseId,
          },
        });

        if (!originInventory) {
          const errorMessage = `Cannot find product with master_product_id ${master_product_id} in warehouse ${originWarehouseId}`;
          throw {
            name: "notFound",
            message: errorMessage,
          };
        }

        if (originInventory.quantity < quantity) {
          const errorMessage = `Not enough stock for product with master_product_id ${master_product_id} in warehouse ${originWarehouseId}`;
          throw {
            name: "exist",
            message: errorMessage,
          };
        }

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

      if (destination !== "Customer") {
        const destinationWarehouse = await prisma.warehouse.findFirst({
          where: { name: destination },
        });

        if (!destinationWarehouse) {
          const errorMessage = `Destination ${destination} does not exist`;
          throw {
            name: "notFound",
            message: errorMessage,
          };
        }

        const destinationWarehouseId = destinationWarehouse.id;

        let destinationInventory = await prisma.inventory.findFirst({
          where: {
            master_product_id: master_product_id,
            warehouse_id: destinationWarehouseId,
          },
        });

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
