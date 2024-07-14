const prisma = require("../lib/prisma");
const { generateResiNumber, sendEmailToBuyer } = require("../lib/nodeMailer");

class OrderServicer {
  static async createOrder(data) {
    const {
      admin_email,
      admin_email_password,
      user_id,
      payment_type,
      order_status,
      buyer_status,
    } = data;

    const admin = await prisma.user.findUnique({
      where: { email: admin_email },
    });

    if (!admin) {
      throw { name: "unAuthorized", message: "Unauthorized user" };
    }

    const order = await prisma.order.create({
      data: {
        user_id: user_id,
        payment_type: payment_type,
        order_status: order_status,
        buyer_status: buyer_status,
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: user_id },
    });

    const user_email = user.email;

    const resiNumber = generateResiNumber(order);
    const emailInfo = sendEmailToBuyer(
      admin_email,
      admin_email_password,
      user_email,
      resiNumber
    );

    async function getData(emailInfo) {
      try {
        let result = await emailInfo;
        return result 
      } catch (error) {
        console.log(error);
      }
    }

    const infoMessageId = await getData(emailInfo)

    return { order: order, admin: admin, resi: resiNumber, info: infoMessageId};
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

  static async updateOrder(data) {
    const { id, user_id, payment_type, order_status, buyer_status } = data;

    const existOrder = await prisma.order.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existOrder) {
      throw { name: "failedToUpdate", message: "Order not found" };
    }

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: {
        user_id: user_id,
        payment_type: payment_type,
        order_status: order_status,
        buyer_status: buyer_status,
      },
    });

    return order;
  }

  static async updateOrderStatus(data) {
    const { id, order_status } = data;

    const existOrder = await prisma.order.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existOrder) {
      throw { name: "failedToUpdate", message: "Order not found" };
    }

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: {
        order_status: order_status,
      },
    });

    return order;
  }

  static async deleteOrder(id) {
    const existOrder = await prisma.order.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existOrder) {
      throw { name: "failedToDelete", message: "Order not found" };
    }

    const order = await prisma.order.delete({
      where: { id: parseInt(id) },
    });
  }
}

module.exports = OrderServicer;
