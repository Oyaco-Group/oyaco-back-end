const AuthService = require("../services/authService");

class AuthController {
  static async register(req, res, next) {
    try {
      const image = req.file;
      const params = {...req.body,image};

      const user = await AuthService.register(params);

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
