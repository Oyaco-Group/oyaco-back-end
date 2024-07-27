const UserService = require("../services/userService");

class UserController {
  static async getListUser(req, res, next) {
    try {
      const { page, limit } = req.query;
      const users = await UserService.getListUser({ page, limit });
      res.status(200).json({
        message: "Success",
        data: users,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      res.status(200).json({
        message: "Success",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getOrderByUserId(req, res, next) {
    try {
      const { id } = req.params;
      const orderUser = await UserService.getOrderByUserId(id);
      if (!orderUser) {
        return res.status(404).json({
          message: "Orders not found for this user",
        });
      }
      res.status(200).json({
        message: "Success",
        data: orderUser,
      });
    } catch (err) {
      next(err);
    }
  }

  static async editUser(req, res, next) {
    try {
      const { id } = req.params;
      const image = req.file || null;
      const params = { ...req.body, id, image };
      const user = await UserService.editUser(params);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      res.status(200).json({
        message: "User is Successfully Updated",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await UserService.deleteUser(id);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      res.status(200).json({
        message: "User is Successfully Deleted",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }

  static async profileUser(req, res, next) {
    try {
      const userId = parseInt(req.user.id, 10);

      const profileData = await UserService.getProfileUser(userId);
      if (!profileData) {
        return res.status(404).json({
          message: "Profile not found",
        });
      }
      res.status(200).json({
        message: "Success",
        status: 200,
        data: profileData,
      });
    } catch (error) {
      console.error("Error in Controller:", error);
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const userId = parseInt(req.user.id, 10);
      const image = req.file || null;
      const params = { ...req.body, id: userId, image };
      const { user, accessToken, refreshToken } =
        await UserService.updateProfile(params);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      res.status(200).json({
        message: "Profile is Successfully Updated",
        data: { user, accessToken, refreshToken },
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;
