const TransService = require("../services/transService");

class TransController {
  static async createTrans(req, res, next) {
    try {
      const data = req.body;
      const productMovements = await TransService.createTrans(data);
      res.status(200).json({
        data: productMovements,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = TransController;
