const prisma = require("../lib/prisma");
const { hashPassword, comparePassword } = require("../lib/bcrypt");
const { generateToken } = require("../lib/jwt");
const fs = require('fs');
const {promisify} = require('util');
const unlinkAsync = promisify(fs.unlink);

class AuthService {
  static async register(data) {
    const { name, email, address, password, user_role, image} = data;
    let image_url;
    const existingUser = await prisma.user.findUnique({
      where : {email}
    })

    if(!image) {
      image_url = null;

      if(existingUser) throw({name : 'failedToCreate', message : 'Email is Already Used'});
      if(!name || !email || !address || !password || !user_role) {
        throw({name : 'failedToCreate', message : 'Please Input Every Field in Form'});
      }

    } else {
      image_url = image.path;
      
      if(existingUser) {
        await unlinkAsync(image_url);
        throw({name : 'failedToCreate', message : 'Email is Already Used'});
      }
      if(!name || !email || !address || !password || !user_role) {
        await unlinkAsync(image_url);
        throw({name : 'failedToCreate', message : 'Please Input Every Field in Form'});
      }
    }
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
