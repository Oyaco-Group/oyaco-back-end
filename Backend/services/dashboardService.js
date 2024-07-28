const prisma = require("../lib/prisma");

class dashboardService {
  static async getDashboardData() {
    try {
      const usersPromise = prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          address: true,
          user_role: true,
          created_at: true,
        },
      });
      const usersCountPromise = prisma.user.count();

      const masterProductsPromise = prisma.masterProduct.findMany({
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
      const masterProductsCountPromise = prisma.masterProduct.count();

      const ordersPromise = prisma.order.findMany({
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
      const ordersCountPromise = prisma.order.count();

      const complaintsPromise = prisma.complaint.findMany({
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
      const complaintsCountPromise = prisma.complaint.count();

      const productMovementsPromise = prisma.productMovement.findMany({
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
      const productMovementsCountPromise = prisma.productMovement.count();

      const [
        users,
        usersCount,
        masterProducts,
        masterProductsCount,
        orders,
        ordersCount,
        complaints,
        complaintsCount,
        productMovements,
        productMovementsCount,
      ] = await Promise.all([
        usersPromise,
        usersCountPromise,
        masterProductsPromise,
        masterProductsCountPromise,
        ordersPromise,
        ordersCountPromise,
        complaintsPromise,
        complaintsCountPromise,
        productMovementsPromise,
        productMovementsCountPromise,
      ]);

      return {
        totalUsers: usersCount,
        users,
        totalMasterProducts: masterProductsCount,
        masterProducts,
        totalOrders: ordersCount,
        orders,
        totalComplaints: complaintsCount,
        complaints,
        totalProductMovements: productMovementsCount,
        productMovements,
      };
    } catch (error) {
      console.error("Error in getDashboardData:", error);
      throw error;
    }
  }
}

module.exports = dashboardService;
