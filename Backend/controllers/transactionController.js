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

  static async updateExpirationStatus(req, res, next) {
    try {
      await TransactionService.updateExpirationStatus();
      res.status(200).json({
        message: "Expiration status updated successfully",
      });
    } catch (err) {
      next(err);
    }
  }

  static async getAllTransactions(req, res, next) {
    try {
      const page = req.query.page;
      const productMovement = await TransactionService.getAllTransactions(page);

      res.status(200).json({
        massage: "success get all transactions",
        data: productMovement,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getTransactionById(req, res, next) {
    try {
      const { id } = req.params;

      const productMovement = await TransactionService.getTransactionById(id);

      res.status(200).json({
        message: "success get transaction",
        data: productMovement,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getOutgoingTransactionsByWarehouseId(req, res, next) {
    try {
      const { warehouseId } = req.params;
      const { page } = req.query;
      const transactions =
        await TransactionService.getOutgoingTransactionsByWarehouseId(
          warehouseId,
          page
        );

      res.status(200).json({
        message: "success get transactions by warehouse id",
        data: transactions,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getIncomingTransactionsByWarehouseId(req, res, next) {
    try {
      const { warehouseId } = req.params;
      const { page } = req.query;
      const transactions =
        await TransactionService.getIncomingTransactionsByWarehouseId(
          warehouseId,
          page
        );

      res.status(200).json({
        message: "success get transactions by warehouse id",
        data: transactions,
      });
    } catch (err) {
      next(err);
    }
  }

  static async sortHighest(req, res, next) {
    try {
      const stockHigh = await TransactionService.sortHighest();
      res.status(200).json({
        message: "Sorted by highest quantity",
        data: stockHigh,
      });
    } catch (err) {
      next(err);
    }
  }

  static async sortLowest(req, res, next) {
    try {
      const stockLow = await TransactionService.sortLowest();
      res.status(200).json({
        message: "Sorted by lowest quantity",
        data: stockLow,
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const productMovement = await TransactionService.delete(id);

      res.status(200).json({
        message: "Transaction deleted",
        data: productMovement,
      });
    } catch (err) {
      next(err);
    }
  }

  static async expirationCheck(req, res, next) {
    try {
      await TransactionService.expirationCheck();
      res.status(200).json({
        message: "Expiration check completed successfully",
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
