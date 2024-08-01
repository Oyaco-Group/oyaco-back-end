const prisma = require("../lib/prisma");
const { hashPassword, comparePassword } = require("../lib/bcrypt");
const { generateToken } = require("../lib/jwt");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

class AuthService {
  static async register(data) {
    const { name, email, address, password, user_role, image } = data;
    const image_url = image ? image.filename : null;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      if (image) await unlinkAsync(image.path);
      throw { name: "failedToCreate", message: "Email is already in use" };
    }

    if (!name || !email || !address || !password || !user_role) {
      if (image) await unlinkAsync(image.path);
      throw {
        name: "failedToCreate",
        message: "Please provide all required fields",
      };
    }

    const hashedPassword = hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        address,
        password: hashedPassword,
        user_role,
        image_url,
      },
    });

    return user;
  }

  static async login(data) {
    const { email, password } = data;
    const existingUser = await prisma.user.findFirst({ where: { email } });

    if (!existingUser || !comparePassword(password, existingUser.password)) {
      throw {
        name: "invalidCredentials",
        message: "Email or password is incorrect",
      };
    }

    const access_token = generateToken({
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.user_role,
    });

    return { access_token: `Bearer ${access_token}` };
  }
}

module.exports = AuthService;
