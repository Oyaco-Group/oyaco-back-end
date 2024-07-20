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
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      if (image) {
        await unlinkAsync(image.path);
      }
      throw { name: "failedToCreate", message: "Email is Already Used" };
    }
    if (!name || !email || !address || !password || !user_role) {
      if (image) {
        await unlinkAsync(image.path);
      }
      throw {
        name: "failedToCreate",
        message: "Please Input Every Field in Form",
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
    const existUser = await prisma.user.findFirst({
      where: { email },
    });

    if (!existUser || !comparePassword(password, existUser.password)) {
      const error = new Error("Email or password is incorrect!");
      error.name = "invalidCredentials";
      throw error;
    }

    const token = generateToken({
      id: existUser.id,
      email: existUser.email,
      role: existUser.user_role,
    });

    const user = {
      id: existUser.id,
      name: existUser.name,
      email: existUser.email,
      role: existUser.user_role,
    };

    return { token, user };
  }
}

module.exports = AuthService;
