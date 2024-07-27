const prisma = require("../lib/prisma");

class OrderItemServicer {
  static async createOrderItem(data) {
    const { order_id, master_product_id, inventory_id, quantity } = data;

    if (!order_id || !master_product_id || !inventory_id || !quantity) {
      throw { name: "invalidInput", message: "All fields are required" };
    }

    const inventoryItem = await prisma.inventory.findUnique({
      where: {
        id: parseInt(inventory_id),
        master_product_id: parseInt(master_product_id),
      },
    });

    if (
      inventoryItem.id !== inventory_id &&
      inventoryItem.master_product_id !== master_product_id
    ) {
      throw { name: "invalidInput", message: "Product not match" };
    } else if (inventoryItem.quantity < quantity) {
      throw { name: "invalidInput", message: "Product quantity not enough" };
    }

    const orderItem = await prisma.order_item.create({
      data: {
        order_id: order_id,
        master_product_id: master_product_id,
        inventory_id: inventory_id,
        quantity: quantity,
      },
    });

    const updateInventory = await prisma.inventory.update({
      where: { id: parseInt(inventoryItem.id) },
      data: {
        master_product_id: inventoryItem.master_product_id,
        wawrehouse_id: inventoryItem.warehouse_id,
        quantity: inventoryItem.quantity - quantity,
        expiration_status: inventoryItem.expiration_status,
      },
    });

    return { orderItem, updateInventory };
  }

  static async getOrderItem(page) {
    const limit = 5;
    const skip = (page - 1) * limit;
    const orderItem = await prisma.order_item.findMany({
      take: limit,
      skip: skip,
    });

    if (!orderItem) {
      throw { name: "notFound", message: "No orders item found" };
    }

    return orderItem;
  }

  static async getOneOrderItem(order_id) {
    const orderItem = await prisma.order_item.findMany({
      where: { order_id: parseInt(order_id) },
      include: {
        master_product: true
      }
    });

    if (!orderItem) {
      throw { name: "notFound", message: "Order item not found" };
    }

    return orderItem;
  }

  static async updateOrderItem(data) {
    const { id, order_id, master_product_id, inventory_id, quantity } = data;

    if (!order_id || !master_product_id || !inventory_id || !quantity) {
      throw { name: "invalidInput", message: "All fields are required" };
    }

    const inventoryItem = await prisma.inventory.findUnique({
      where: {
        id: parseInt(inventory_id),
        master_product_id: parseInt(master_product_id),
      },
    });

    if (!inventoryItem) {
      throw { name: "invalidInput", message: "Inventory item not found" };
    }

    const orderItem = await prisma.order_item.findUnique({
      where: { id: parseInt(id) },
    });

    if (!orderItem) throw { name: "notFound", message: "Order item not found" };

    if(inventory_id !== orderItem.inventory_id) {
        const updateOrderItem = await prisma.order_item.update({
          where : {id : parseInt(id)},
          data : {
            order_id : order_id,
            master_product_id : master_product_id,
            inventory_id : inventory_id,
            quantity : quantity
          }
        })

        const oldInventory = await prisma.inventory.findUnique({
          where : {id : orderItem.inventory_id}
        })
        const oldQuantity = oldInventory.quantity;
        const returnQuantity = orderItem.quantity;

        const updateOldInventory = await prisma.inventory.update({
          where : {id : orderItem.inventory_id},
          data : {
            quantity : oldQuantity + returnQuantity
          }
        })

        const newQuantity = inventoryItem.quantity;

        const updateNewInventory = await prisma.inventory.update({
          where : {id : inventory_id},
          data : {
            quantity : newQuantity - quantity
          }
        })

        return {updateOrderItem, updateOldInventory, updateNewInventory}


    } else {
        const updateOrderItem = await prisma.order_item.update({
          where: { id: parseInt(id) },
          data: {
            order_id: order_id,
            master_product_id: master_product_id,
            inventory_id: inventory_id,
            quantity: quantity,
          },
        });
    
        const quantityDifference = quantity - orderItem.quantity;
    
        const updateInventory = await prisma.inventory.update({
          where: { id: parseInt(inventoryItem.id) },
          data: {
            quantity: inventoryItem.quantity - quantityDifference,
          },
        });
    
        return { updateOrderItem, updateInventory };
    }

  }

  static async deleteOrderItem(id) {
    const existOrderItem = await prisma.order_item.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existOrderItem) {
      throw { name: "failedToDelete", message: "Order not found" };
    }

    const inventoryItem = await prisma.inventory.findUnique({
      where: {
        id: parseInt(existOrderItem.inventory_id),
        master_product_id: parseInt(existOrderItem.master_product_id),
      },
    });

    if (
      inventoryItem.id !== existOrderItem.inventory_id &&
      inventoryItem.master_product_id !== existOrderItem.master_product_id
    ) {
      throw { name: "invalidInput", message: "Product not match" };
    }

    const updateInventory = await prisma.inventory.update({
      where: { id: parseInt(inventoryItem.id) },
      data: {
        master_product_id: inventoryItem.master_product_id,
        wawrehouse_id: inventoryItem.wawrehouse_id,
        quantity: inventoryItem.quantity + existOrderItem.quantity,
        expiration_status: inventoryItem.expiration_status,
      },
    });

    const orderItem = await prisma.order_item.delete({
      where: { id: parseInt(id) },
    });

    return updateInventory;
  }
}

module.exports = OrderItemServicer;
