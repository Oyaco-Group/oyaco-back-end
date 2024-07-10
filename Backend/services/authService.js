const prisma = require("../lib/prisma");
const { hashPassword, comparePassword } = require("../lib/bcrypt");
const { generateToken } = require("../lib/jwt");

class AuthService {
  static async register(data) {
    const { name, email, address, password, user_role } = data;
    const hashedPassword = hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        address: address,
        password: hashedPassword,
        user_role: user_role,
      },
    });

    return user;
  }

  static async login(data) {
    const { email, password } = data;
    const existUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!existUser || !comparePassword(password, existUser.password)) {
      throw { name: "InvalidCredentials" };
    }

    const token = generateToken({
      id: existUser.id,
      email: existUser.email,
      role: existUser.user_role,
    });
    return token;
  }
}

module.exports = AuthService;
