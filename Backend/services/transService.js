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
      let productMovementIn = null; // Define productMovementIn here

      if (origin !== "Supplier") {
        const originWarehouse = await prisma.warehouse.findFirst({
          where: { name: origin },
        });

        if (!originWarehouse) {
          throw new Error(`Warehouse with name ${origin} not found`);
        }

        originWarehouseId = originWarehouse.id;

        let originInventory = await prisma.inventory.findFirst({
          where: {
            master_product_id: master_product_id,
            warehouse_id: originWarehouseId,
          },
        });

        if (!originInventory) {
          throw new Error(`Inventory for product ${master_product_id} in warehouse ${originWarehouseId} not found`);
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
          },
        });
      } else {
        // Handling case where origin is "Supplier" without warehouse creation
        productMovementOut = await prisma.productMovement.create({
          data: {
            user_id,
            master_product_id,
            inventory_id: inventory_id, // Assuming you have a way to determine this
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
          throw new Error(`Warehouse with name ${destination} not found`);
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
          },
        });
      }

      return { productMovementOut, productMovementIn };
    });
  }
}

module.exports = TransService;
