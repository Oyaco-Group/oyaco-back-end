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
    try {
      const page = req.query.page;
      const orders = await OrderService.getOrder(page);

      res.status(200).json({
        massage: "success get all orders",
        data: orders,
      });
    } catch (err) {
      next(err);
    }
  }
  // admin get order by id
  static async getOneOrder(req, res, next) {
    try {
      const {id} = req.params;

      const order = await OrderService.getOneOrder(id);

      res.status(200).json({
        massage: "success get order",
        data: order,
      });
    } catch (err) {}
  }
  // admin get nomor resi
  // user get email and no resi
  // user get order_item
  // user update order status
  // delete order
}

module.exports = OrderController;
