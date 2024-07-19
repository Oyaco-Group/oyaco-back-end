const prisma = require("../lib/prisma");
const { generateResiNumber, sendEmailToBuyer } = require("../lib/nodeMailer");
const { updateOrderStatus } = require("../lib/statusUpdater");

class OrderServicer {
  static async createOrder(data) {
    const { user_id, payment_type, order_status, buyer_status } = data;

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
    const emailInfo = sendEmailToBuyer(user_email, resiNumber);

    async function getData(emailInfo) {
      try {
        let result = await emailInfo;
        return result;
      } catch (error) {
        console.log(error);
      }
    }

    const infoMessageId = await getData(emailInfo);

    // Tentukan waktu untuk memanggil updateOrderStatus
    const scheduledTime = new Date(order.created_at.getTime() + 1 * 60 * 1000); // 1 menit setelah pembuatan order

    // Jadwalkan pemanggilan updateOrderStatus menggunakan setTimeout
    const delay = scheduledTime - new Date();
    setTimeout(async () => {
      console.log("Running order status update job...");
      await updateOrderStatus(order.id);
    }, delay);

    return { order: order, resi: resiNumber, info: infoMessageId };
  }

  static async getOrder(skip, take) {
    const orders = await prisma.order.findMany({
      skip: skip,
      take: take,
      include : {
        complaint : true
      }
    });

    const totalOrders = await prisma.order.count();

    if (!orders) {
      throw { name: "notFound", message: "No orders found" };
    }

    return { orders, totalOrders };
  }

  static async getOneOrder(id) {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include : {
        order_item : {
          select : {
            quantity : true,
            master_product : true,
          }
        },
        user : {
          select : {
            name : true,
            email : true,
            address : true,
          }
        },
        
      }
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
