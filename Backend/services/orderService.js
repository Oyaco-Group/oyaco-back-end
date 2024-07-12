const prisma = require("../lib/prisma");

class OrderServicer {
  static async createOrder(data) {
    const { user_id, complaint_id, payment_type, order_status, buyer_status } =
      data;

    const order = await prisma.order.create({
      data: {
        user_id: user_id,
        complaint_id: complaint_id,
        payment_type: payment_type,
        order_status: order_status,
        buyer_status: buyer_status,
      },
    });

    return order;
  }

  static async getOrder(page) {
    const limit = 5;
    const skip = (page - 1) * limit;
    const orders = await prisma.order.findMany({
      take: limit,
      skip: skip,
    });

    if (!orders) {
      throw { name: "notFound", message: "No orders found" };
    }

    return orders;
  }

  static async getOneOrder(id) {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
    });

    if (!order) {
      throw { name: "notFound", message: "Order not found" };
    }

    return order;
  }
}

module.exports = OrderServicer;
