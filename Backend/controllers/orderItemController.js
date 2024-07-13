const OrderItemService = require("../services/orderItemService");
class OrderItemController {

  // admin create order
  static async createOrderItem(req, res, next) {
    try {
      const { admin_email ,user_id, payment_type, order_status, buyer_status } = req.body;

      const orderItem = await OrderItemService.createOrder({
        admin_email,
        user_id,
        payment_type,
        order_status,
        buyer_status,
      });

      res.status(201).json({
        message: "Order created successfully",
        data: orderItem,
      });
    } catch (err) {
      next(err);
    }
  }

  // admin get order
  static async getOrderItem(req, res, next) {
    try {
      const page = req.query.page;
      const orderItem = await OrderItemService.getOrder(page);

      res.status(200).json({
        message: "Success get all orders",
        data: orderItem,
      });
    } catch (err) {
      next(err);
    }
  }

  // admin get order by id
  static async getOneOrderItem(req, res, next) {
    try {
      const { id } = req.params;

      const orderItem = await OrderItemService.getOneOrder(id);

      res.status(200).json({
        message: "Success get order",
        data: orderItem,
      });
    } catch (err) {
      next(err);
    }
  }
  

  // admin update order
  static async updateOrderItem(req, res, next) {
    try {
      const { id } = req.params;
      const { user_id, payment_type, order_status, buyer_status } = req.body;

      const orderItem = await OrderItemService.updateOrder({
        id,
        user_id,
        payment_type,
        order_status,
        buyer_status,
      });

      res.status(200).json({
        message: "Success update order",
        data: orderItem,
      });
    } catch (err) {
      next(err);
    }
  }

  // delete order
  static async deleteOrderItem(req, res, next) {
    try {
      const { id } = req.params;
      await OrderItemService.deleteOrder(id);
      res.status(200).json({
        message: "Successfully delete order",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = OrderItemController;
