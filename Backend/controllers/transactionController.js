const TransactionService = require("../services/transactionService");

class TransactionController {
  static async createTrans(req, res, next) {
    try {
      const data = req.body;
      const productMovements = await TransactionService.createTrans(data);
      res.status(200).json({
        data: productMovements,
      });
    } catch (err) {
      next(err);
    }
  }
}

// Contoh input postman:
// {
//   "user_id": 1,
//   "master_product_id": 1,
//   "inventory_id": 1,
//   "movement_type": "In",
//   "origin": "Warehouse 1",
//   "destination": "Warehouse 2",
//   "quantity": 20,
//   "iscondition_good": true
// }

module.exports = TransactionController;
