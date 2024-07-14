const { order_item } = require("../lib/prisma");
const OrderItemService = require("../services/orderItemService");
class OrderItemController {
  // admin create order
  static async createOrderItem(req, res, next) {
    try {
      const { order_id, master_product_id, inventory_id, quantity } = req.body;

      const orderItem = await OrderItemService.createOrderItem({
        order_id,
        master_product_id,
        inventory_id,
        quantity,
      });

      res.status(201).json({
        message: "Order item created successfully",
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
      const orderItem = await OrderItemService.getOrderItem(page);

      res.status(200).json({
        message: "Success get all order item",
        data: orderItem,
      });
    } catch (err) {
      next(err);
    }
  }

  // admin get order by id
  static async getOneOrderItem(req, res, next) {
    try {
      const {order_id} = req.params;
      
      const orderItem = await OrderItemService.getOneOrderItem(order_id);

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
      const { order_id, master_product_id, inventory_id, quantity } = req.body;

      const orderItem = await OrderItemService.updateOrderItem({
        id,
        order_id,
        master_product_id,
        inventory_id,
        quantity,
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
      const orderItem = await OrderItemService.deleteOrderItem(id);
      res.status(200).json({
        message: "Successfully delete order",
        data: orderItem
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = OrderItemController;
