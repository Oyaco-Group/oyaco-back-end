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
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        user_role: true,
        image_url : true
      },
    });
    return { users, total_user, total_page };
  }

  static async getUserById(id) {
    try {
      const userId = parseInt(id, 10);
      if (isNaN(userId)) {
        throw new Error("Invalid user ID");
      }
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
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
      if (isNaN(id)) {
        throw new Error("Invalid user ID");
      }
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      console.error("Error in getUserById:", error); // Debugging line
      throw error;
    }
  }

  static async getUserByEmail(params) {
    const{email} = params;
    const user = await prisma.user.findUnique({
      where : {email},
      select : {
        id : true,
        name : true,
        email : true,
        user_role : true,
        address : true,
      }
    })
    if(!user) throw({name : 'notFound', message : 'User is Not Found'});

    return user;
  }

  static async getOrderByUserId(id) {
    const order = await prisma.user.findUnique({
      where: {
        id: +id,
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
    const image_url = image ? image.filename : null;

    const existingUser = await prisma.user.findUnique({ where: { id: +id } });
    if (!existingUser) {
      if (image) await unlinkAsync(image.path);
      throw {
        name: "failedToUpdate",
        message: "Update is Failed, No Existing User",
      };
    }

    if (!name || !email || !address) {
      if (image) await unlinkAsync(image.path);
      throw {
        name: "failedToUpdate",
        message: "Please Input Every Field in Form",
      };
    }

    const emailUser = await prisma.user.findUnique({ where: { email } });
    if (emailUser && emailUser.id !== existingUser.id) {
      if (image) await unlinkAsync(image.path);
      throw { name: "failedToUpdate", message: "Email already used" };
    }

    if (
      existingUser.image_url &&
      image_url &&
      existingUser.image_url !== image_url
    ) {
      await unlinkAsync(path.join("assets/user/", existingUser.image_url));
    }

    const hashedPassword = password
      ? hashPassword(password)
      : existingUser.password;

    const user = await prisma.user.update({
      where: { id: +id },
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

  static async deleteUser(id) {
    const existingUser = await prisma.user.findUnique({ where: { id: +id } });
    if (!existingUser)
      throw {
        name: "failedToDelete",
        message: "Cannot delete, User not found",
      };

    if (existingUser.image_url) {
      await unlinkAsync(path.join("assets/user/", existingUser.image_url));
    }

    const user = await prisma.user.delete({
      where: { id: +id },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
      },
    });

    return user;
  }

  static async getProfileUser(userId) {
    try {
      const id = parseInt(userId, 10);
      if (isNaN(id)) {
        throw new Error("Invalid user ID");
      }
      const userProfile = await prisma.user.findUnique({
        where: {
          id: id,
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

      if (!userProfile) {
        throw new Error("User not found");
      }
      return userProfile;
    } catch (error) {
      console.error("Error in getProfileUser:", error);
      throw error;
    }
  }

  static async updateProfile(params) {
    const { id, name, email, password, address, user_role, isdelete, image } =
      params;
    const isdeleteBoolean = isdelete === "true";
    const image_url = image ? image.filename : null;

    const existingUser = await prisma.user.findUnique({ where: { id: +id } });
    if (!existingUser) {
      if (image) await unlinkAsync(image.path);
      throw {
        name: "failedToUpdate",
        message: "Update is Failed, No Existing User",
      };
    }

    if (!name || !email || !address) {
      if (image) await unlinkAsync(image.path);
      throw {
        name: "failedToUpdate",
        message: "Please Input Every Field in Form",
      };
    }

    const emailUser = await prisma.user.findUnique({ where: { email } });
    if (emailUser && emailUser.id !== existingUser.id) {
      if (image) await unlinkAsync(image.path);
      throw { name: "failedToUpdate", message: "Email already used" };
    }

    if (
      existingUser.image_url &&
      image_url &&
      existingUser.image_url !== image_url
    ) {
      await unlinkAsync(path.join("assets/user/", existingUser.image_url));
    }

    const hashedPassword = password
      ? hashPassword(password)
      : existingUser.password;

    const user = await prisma.user.update({
      where: { id: +id },
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
        user_role: true,
        image_url: true,
      },
    });

    // Generate new tokens
    const { accessToken, refreshToken } = generateToken(user);

    // Update the user's refresh token
    await prisma.user.update({
      where: { id: +id },
      data: { refreshToken },
    });

    return { user, accessToken, refreshToken };
  }
}

module.exports = UserService;
