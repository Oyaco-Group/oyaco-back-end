const OrderService = require("../services/orderService");
const OrderService2 = require("../services/orderService2");
class OrderController {
  // admin create order
  static async createOrder(req, res, next) {
    try {
      const { user_id, payment_type, order_status, buyer_status, products } = req.body;

      const orderData = await OrderService2.createOrder({
        user_id,
        payment_type,
        order_status,
        buyer_status,
        products
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
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 5;

      const skip = (page - 1) * pageSize;
      const take = pageSize;
      const orders = await OrderService.getOrder(skip, take);

      res.status(200).json({
        message: "Success get all orders",
        data: orders.orders,
        metadata: {
          total: orders.totalOrders,
          page: page,
          pageSize: pageSize,
          totalPages: Math.ceil(orders.totalOrders / pageSize),
        },
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
  static async getOneOrderUser(req, res, next) {
    try {
      const { user_id } = req.params;
      const order = await OrderService.getOneOrderUser(user_id);

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

      const order = await OrderService2.updateOrderStatus({
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

  // user update order
  static async updateOrder(req, res, next) {
    try {
      const { id } = req.params;
      const { user_id, payment_type, order_status, buyer_status, products } = req.body;

      const order = await OrderService2.updateOrder({
        id,
        user_id,
        payment_type,
        order_status,
        buyer_status,
        products
      });

      res.status(200).json({
        message: "Success update order",
        data: order,
      });
    } catch (err) {
      next(err);
    }
  }

  static async sendOrder(req,res,next) {
    try {
      const {id} = req.params;
      const {user_id} = req.body;
      const orderData = await OrderService2.sendOrder({id,user_id})
      res.status(200).json({
        message : 'Success send order',
        data : orderData
      }) 
    } catch(err) {
      next(err)
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
