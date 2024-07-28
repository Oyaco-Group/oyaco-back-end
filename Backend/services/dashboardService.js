const prisma = require("../lib/prisma");

class dashboardService {
  static async getDashboardData() {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          address: true,
          user_role: true,
          created_at: true,
        },
      });

      const masterProducts = await prisma.masterProduct.findMany({
        select: {
          id: true,
          name: true,
          sku: true,
          price: true,
          category: {
            select: {
              name: true,
            },
          },
          created_at: true,
        },
      });

      const orders = await prisma.order.findMany({
        select: {
          id: true,
          payment_type: true,
          order_status: true,
          buyer_status: true,
          created_at: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      const complaints = await prisma.complaint.findMany({
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
      });

      const productMovements = await prisma.productMovement.findMany({
        select: {
          id: true,
          movement_type: true,
          quantity: true,
          arrival_date: true,
          origin: true,
          destination: true,
          master_product: {
            select: {
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
      });

      return {
        users,
        masterProducts,
        orders,
        complaints,
        productMovements,
      };
    } catch (error) {
      console.error("Error in getDashboardData:", error);
      throw error;
    }
  }
}

module.exports = dashboardService;
