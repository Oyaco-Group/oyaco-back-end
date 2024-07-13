const prisma = require("../lib/prisma");

class OrderItemServicer {
  static async createItemOrder(data) {
    const { admin_email, user_id, payment_type, order_status, buyer_status } =
      data;

    const orderItem = await prisma.order_item.create({
      data: {
        user_id: user_id,
        payment_type: payment_type,
        order_status: order_status,
        buyer_status: buyer_status,
      },
    });


    return orderItem;
  }

  static async getItemOrder(page) {
    const limit = 5;
    const skip = (page - 1) * limit;
    const orderItem = await prisma.order_item.findMany({
      take: limit,
      skip: skip,
    });

    if (!orderItem) {
      throw { name: "notFound", message: "No orders found" };
    }

    return orderItem;
  }

  static async getOneOrderItem(id) {
    const orderItem = await prisma.order_item.findUnique({
      where: { id: parseInt(id) },
    });

    if (!orderItem) {
      throw { name: "notFound", message: "Order not found" };
    }

    return orderItem;
  }

  static async updateOrderItem(data) {
    const { id, user_id, payment_type, order_status, buyer_status } = data;

    const existOrderItem = await prisma.order.findUnique({
      where: {id : parseInt(id)}
    })
    
    if (!existOrderItem) {
      throw { name: "failedToUpdate", message: "Order not found" };
    }

    const orderItem = await prisma.order_item.update({
      where: { id: parseInt(id) },
      data: {
        user_id: user_id,
        payment_type: payment_type,
        order_status: order_status,
        buyer_status: buyer_status,
      },
    });

    return orderItem;
  }

  static async deleteOrderItem(id) {
    const existOrderItem = await prisma.order_item.findUnique({
      where: {id : parseInt(id)}
    })
    
    if (!existOrderItem) {
      throw { name: "failedToDelete", message: "Order not found" };
    }

    const orderItem = await prisma.order.delete({
      where: { id: parseInt(id) },
    });
  }
}

module.exports = OrderItemServicer;
