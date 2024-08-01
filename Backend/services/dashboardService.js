const prisma = require("../lib/prisma");

class DashboardService {
  static async getDashboardData() {
    try {
      // Hitung total users, master products, orders, complaints, dan product movements
      const [
        total_users,
        total_products,
        total_orders,
        total_complaints,
        total_product_movements,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.masterProduct.count(),
        prisma.order.count(),
        prisma.complaint.count(),
        prisma.productMovement.count(),
      ]);

      // Ambil data users, master products, orders, complaints, dan product movements
      const [users, masterProducts, orders, complaints, productMovements] =
        await Promise.all([
          prisma.user.findMany({
            select: {
              id: true,
              name: true,
              email: true,
              address: true,
              user_role: true,
              created_at: true,
            },
          }),
          prisma.masterProduct.findMany({
            select: {
              id: true,
              name: true,
              sku: true,
              price: true,
              image: true,
              category: {
                select: {
                  name: true,
                },
              },
              created_at: true,
            },
          }),
          prisma.order.findMany({
            select: {
              id: true,
              payment_type: true,
              order_status: true,
              buyer_status: true,
              created_at: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              order_item: {
                select: {
                  master_product: {
                    select: {
                      name: true,
                      sku: true,
                      image: true,
                      price: true,
                      category: {
                        select: {
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          }),
          prisma.complaint.findMany({
            select: {
              id: true,
              text: true,
              iscomplaint: true,
              created_at: true,
              order: {
                select: {
                  id: true,
                  order_item: {
                    select: {
                      master_product: {
                        select: {
                          name: true,
                          sku: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          }),
          prisma.productMovement.findMany({
            select: {
              id: true,
              movement_type: true,
              quantity: true,
              arrival_date: true,
              origin: true,
              destination: true,
              expiration_date: true,
              expiration_status: true,
              master_product: {
                select: {
                  image: true,
                  name: true,
                  sku: true,
                },
              },
              user: {
                select: {
                  name: true,
                },
              },
            },
          }),
        ]);

      // Filter transaksi incoming dan outgoing
      const transactions_incoming = productMovements.filter(
        (movement) => movement.movement_type.toLowerCase() === "in"
      );

      const transactions_outgoing = productMovements.filter(
        (movement) => movement.movement_type.toLowerCase() === "out"
      );

      return {
        total_users,
        users,
        total_products,
        masterProducts,
        total_orders,
        orders,
        total_complaints,
        complaints,
        total_product_movements,
        transactions_incoming,
        transactions_outgoing,
      };
    } catch (error) {
      console.error("Error in getDashboardData:", error);
      throw error;
    }
  }
}

module.exports = DashboardService;
