const dashboardService = require("../services/dashboardService");
const UserService = require("../services/userService");

class dashboardController {
  static async getDashboard(req, res, next) {
    try {
      const dashboardData = await dashboardService.getDashboardData();
      res.status(200).json({
        message: "Success",
        status: 200,
        data: dashboardData,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = dashboardController;
