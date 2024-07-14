const OrderService = require("../services/orderService");
class OrderController {

  // admin create order
  static async createOrder(req, res, next) {
    try {
      const { admin_email, admin_email_password, user_id, payment_type, order_status, buyer_status } = req.body;

      const orderData = await OrderService.createOrder({
        admin_email,
        admin_email_password,
        user_id,
        payment_type,
        order_status,
        buyer_status,
      });

      res.status(201).json({
        message: "Order created successfully",
        data: orderData,
      });
    } catch (err) {
      next(err);
    }
  }

  // admin get order
  static async getOrder(req, res, next) {
    try {
      const page = req.query.page;
      const orders = await OrderService.getOrder(page);

      res.status(200).json({
        message: "Success get all orders",
        data: orders,
      });
    } catch (err) {
      next(err);
    }
  }

  // admin get order by id
  static async getOneOrder(req, res, next) {
    try {
      const { id } = req.params;

      const order = await OrderService.getOneOrder(id);

      res.status(200).json({
        message: "Success get order",
        data: order,
      });
    } catch (err) {
      next(err);
    }
  }
  
  // user update status order
  static async updateOrderStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { order_status } = req.body;

      const order = await OrderService.updateOrderStatus({
        id,
        order_status,
      });

      res.status(200).json({
        message: "Success update order status",
        data: order,
      });
    } catch (err) {
      next(err);
    }
  }

  // admin update order
  static async updateOrder(req, res, next) {
    try {
      const { id } = req.params;
      const { user_id, payment_type, order_status, buyer_status } = req.body;

      const order = await OrderService.updateOrder({
        id,
        user_id,
        payment_type,
        order_status,
        buyer_status,
      });

      res.status(200).json({
        message: "Success update order",
        data: order,
      });
    } catch (err) {
      next(err);
    }
  }

  // delete order
  static async deleteOrder(req, res, next) {
    try {
      const { id } = req.params;
      await OrderService.deleteOrder(id);
      res.status(200).json({
        message: "Successfully delete order",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = OrderController;
