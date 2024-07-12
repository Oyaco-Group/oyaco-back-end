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

  static async getOrder(pagination) {
    const { take, skip } = pagination;
    const orders = await prisma.order.findMany({
      take: parseInt(take),
      skip: parseInt(skip),
    });

    if (!orders){
        throw { name: "notFound", message: "No orders found" };
    }

    return orders
  }
}

module.exports = OrderServicer;
