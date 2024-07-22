const { hashPassword } = require("../lib/bcrypt");
const prisma = require("../lib/prisma");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

class UserService {
  static async getListUser(params) {
    const { page, limit } = params;
    const skip = (page - 1) * limit;
    const take = +limit;

    const total_user = await prisma.user.count({
      where: {
        user_role: "user",
      },
    });

    const total_page = Math.ceil(total_user / take);

    const users = await prisma.user.findMany({
      skip,
      take,
      where: {
        user_role: "user",
select: {
        id: true,
        name: true,
        email: true,
        address: true,
        user_role: true,
      },
    });
    return { users, total_user, total_page };
  }

  static async getUserById(params) {
    const user = await prisma.user.findUnique({
      where: {
        id: +params,
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        user_role: true,
        image_url: true,
      },
    });
    return user;
  }

  static async getOrderByUserId(params) {
    const order = await prisma.user.findUnique({
      where: {
        id: +params,
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        order: true,
      },
    });
    return order;
  }

  static async editUser(params) {
    const { id, name, email, password, address, user_role, isdelete, image } =
      params;
    const isdeleteBoolean = isdelete === "true";
    const image_url = image ? image.filename : "";
    let imagePath;

    // Find the existing user to update
    const existingUser = await prisma.user.findUnique({
      where: {
        id: +id,
      },
    });

    if (!existingUser) {
      if (image) {
        await unlinkAsync(image.path);
      }
      throw {
        name: "failedToUpdate",
        message: "Update is Failed, No Existing User",
      };
    }

    // If image is provided, handle file
    if (image) {
      imagePath = image.path;
    } else {
      imagePath = null;
    }

    // Validate input
    if (!name || !email || !address) {
      if (image) {
        await unlinkAsync(imagePath);
      }
      throw {
        name: "failedToUpdate",
        message: "Please Input Every Field in Form",
      };
    }

    // Check if the email is already used by another user
    const emailUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (emailUser && emailUser.id !== existingUser.id) {
      if (image) {
        await unlinkAsync(imagePath);
      }
      if (existingUser.image_url) {
        await unlinkAsync(
          `${path.join("assets/user/", existingUser.image_url)}`
        );
      }
      throw {
        name: "failedToUpdate",
        message: "Email already used",
      };
    }

    // Handle image removal if changed
    if (
      existingUser.image_url &&
      image_url &&
      existingUser.image_url !== image_url
    ) {
      await unlinkAsync(`${path.join("assets/user/", existingUser.image_url)}`);
    }

    // Hash password
    const hashedPassword = hashPassword(password);

    // Update user
    const user = await prisma.user.update({
      where: {
        id: +id,
      },
      data: {
        name,
        email,
        address,
        user_role,
        image_url,
        password: hashedPassword,
        isdelete: isdeleteBoolean,
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
      },
    });

    return user;
  }

  static async deleteUser(params) {
    const existingUser = await prisma.user.findUnique({
      where: {
        id: +params,
      },
    });
    if (!existingUser)
      throw {
        name: "failedToDelete",
        message: "Can not Delete, User is Not Found",
      };
    if (existingUser.image_url) {
      await unlinkAsync(existingUser.image_url);
    }
    const user = await prisma.user.delete({
      where: {
        id: +params,
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
      },
    });
    return user;
  }
}

module.exports = UserService;
