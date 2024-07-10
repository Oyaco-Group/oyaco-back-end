const AuthService = require("../services/authService");

class AuthController {
  static async register(req, res, next) {
    try {
      const { name, email, address, password, user_role } = req.body;

      const user = await AuthService.register({
        name,
        email,
        address,
        password,
        user_role,
      });

      res.status(201).json({
        message: "User Registered Successfully",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      let data = await AuthService.login({
        email, password
      })
     
      res.status(201).json({
        message: "Login Successfully",
        data: data,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthController;
