const OrderService = require("../services/orderService");
class OrderController {
  // admin create order
  static async createOrder(req, res, next) {
    try {
      const {
        user_id,
        complaint_id,
        payment_type,
        order_status,
        buyer_status,
      } = req.body;

      const order = await OrderService.createOrder({
        user_id,
        complaint_id,
        payment_type,
        order_status,
        buyer_status,
      });

      res.status(201).json({
        message: "Order Created Successfully",
        data: order,
      });
    } catch (err) {
      next(err);
    }
  }
  // admin get order
  static async getOrder(req, res, next) {
    const { page = 1, take = 5 } = req.query;
    const skip = (page - 1) * take;

    try {
      const orders = await OrderService.getOrder({
        take,
        skip,
      });

      res.status(200).json({
        totalItems: orders.count,
        totalPages: Math.ceil(orders.count / limit),
        currentPage: parseInt(page),
        orders: orders.rows,
      });
    } catch (err) {
      next(err);
    }
  }
  // admin get order by id
  // admin get nomor resi
  // user get email and no resi
  // user get order_item
  // user update order status
  // delete order
}

module.exports = OrderController;
