const dashboardService = require("../services/dashboardService");
const UserService = require("../services/userService");

class dashboardController {
  // ... Existing methods

  static async getDashboard(req, res, next) {
    try {
      const dashboardData = await dashboardService.getDashboardData();
      res.status(200).json({
        message: "Dashboard data retrieved successfully",
        data: dashboardData,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = dashboardController;
