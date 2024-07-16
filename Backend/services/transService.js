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

      let originWarehouseId = null;
      let productMovementOut = null;
      let productMovementIn = null;

      if (origin !== "Supplier") {
        const originWarehouse = await prisma.warehouse.findFirst({
          where: { name: origin },
        });

        if (!originWarehouse) {
          throw { name: "invalidInput", message: `Invalid origin input` };
          // throw new Error(`Warehouse with name ${origin} not found`);
        }

        originWarehouseId = originWarehouse.id;

        let originInventory = await prisma.inventory.findFirst({
          where: {
            master_product_id: master_product_id,
            warehouse_id: originWarehouseId,
          },
        });

        if (!originInventory) {
          throw {
            name: "notFound",
            message: `Product with master product id ${master_product_id} is not found in origin warehouse`,
          };
          // throw new Error(
          //   `Inventory for product ${master_product_id} in warehouse ${originWarehouseId} not found`
          // );
        }

        if (originInventory.quantity < quantity) {
          throw {
            name: "exist",
            message: `Not enough stock for product with master product id ${master_product_id} in warehouse ${originWarehouseId}`,
          };
          // throw new Error(
          //   `Not enough stock for product ${master_product_id} in warehouse ${originWarehouseId}`
          // );
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
      } else {
        productMovementOut = await prisma.productMovement.create({
          data: {
            user_id,
            master_product_id,
            inventory_id: inventory_id || null,
            movement_type: "Out",
            origin,
            destination,
            quantity,
            iscondition_good,
            arrival_date,
            expiration_date,
          },
        });
      }

      if (destination !== "Customer") {
        const destinationWarehouse = await prisma.warehouse.findFirst({
          where: { name: destination },
        });

        if (!destinationWarehouse) {
          throw {
            name: "notFound",
            message: `Destination ${destination} is not available`,
          };
          // throw new Error(`Warehouse with name ${destination} not found`);
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
