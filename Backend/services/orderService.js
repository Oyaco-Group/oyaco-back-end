const prisma = require("../lib/prisma");
const { generateResiNumber, sendEmailToBuyer } = require("../lib/nodeMailer");
const { updateOrderStatus } = require("../lib/statusUpdater");

class OrderServicer {
  static async createOrder(params) {
    const { user_id, payment_type, order_status, buyer_status, products } =
      params;

    const order = await prisma.order.create({
      data: {
        user_id: +user_id,
        payment_type,
        order_status,
        buyer_status,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
          },
        },
      },
    });

    const createOrderItem = async () => {
      for (const product of products) {
        product.order_id = order.id;
        const inventory = await prisma.inventory.findUnique({
          where: { id: +product.inventory_id },
        });
        const quantityInventory = inventory.quantity;
        if (product.quantity > quantityInventory) {
          throw {
            name: "invalidInput",
            message: "Product quantity is not Enough",
          };
        }
        await prisma.order_item.create({
          data: { ...product },
        });
        const quantityDifference = quantityInventory - product.quantity;
        await prisma.inventory.update({
          where: { id: +product.inventory_id },
          data: {
            quantity: quantityDifference,
          },
        });
      }
    };
    await createOrderItem();

    const complaint = await prisma.complaint.create({
      data: {
        order_id: order.id,
        iscomplaint: false,
      },
    });

    return order;
  }

  static async getOrder(skip, take) {
    const orders = await prisma.order.findMany({
      skip: skip,
      take: take,
      include: {
        complaint: true,
      },
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
      include: {
        order_item: {
          select: {
            id: true,
            quantity: true,
            master_product: true,
            inventory: {
              select: {
                quantity: true,
                warehouse: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            address: true,
          },
        },
      },
    });

    if (!order) {
      throw { name: "notFound", message: "Order not found" };
    }

    return order;
  }

  static async getOneOrderUser(data) {
    const { skip, take, user_id } = data;
    const orders = await prisma.order.findMany({
      skip: +skip,
      take: +take,
      where: { user_id: +user_id },
      include: {
        complaint: true,
      },
    });

    const totalOrders = await prisma.order.count();

    if (!orders) {
      throw { name: "notFound", message: "Order not found" };
    }

    return { orders, totalOrders };
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

  static async sendOrder(params) {
    const { id, user_id } = params;

    const order = await prisma.order.findUnique({
      where: { id: +id },
    });
    const user = await prisma.user.findUnique({
      where: { id: +user_id },
    });
    const email = user.email;

    const resiNumber = generateResiNumber(order);
    const emailInfo = sendEmailToBuyer(email, resiNumber);

    async function getData(emailInfo) {
      try {
        let result = await emailInfo;
        return result;
      } catch (error) {
        console.log(error);
      }
    }

    const infoMessageId = await getData(emailInfo);

    const scheduledTime = new Date().getTime() + 6 * 1000; // 1 menit setelah pembuatan order

    const delay = scheduledTime - new Date();
    setTimeout(async () => {
      console.log("Running order status update job...");
      await updateOrderStatus(order.id);
    }, delay);

    return { resi: resiNumber, info: infoMessageId };
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
