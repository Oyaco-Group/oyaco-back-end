const prisma = require("./prisma");

async function updateOrderStatus(id) {
  try {
    // Ambil semua order yang statusnya belum selesai
    const orders = await prisma.order.findUnique({
      where: {
        id: id,
      },
    });

    // Periksa setiap order
     const newStatusOrder = await prisma.order.update({
        where: { id: orders.id },
        data: {
          order_status: "On Delivery", // atau status lain yang sesuai
        },
      });
      console.log(`Order ${newStatusOrder.id} on delivery after 1 minute.`);
  } catch (error) {
    console.error("Error updating order status:", error);
  }
}

module.exports = { updateOrderStatus };
