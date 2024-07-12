const prisma = require("../lib/prisma");

class CategoryService {
  static async getListCategories() {
    try {
      return await prisma.Category.findMany();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async create(name) {
    try {
      return await prisma.Category.create({
        data: { name: name },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async edit(id, name) {
    try {
      return await prisma.Category.update({
        where: { id: parseInt(id) },
        data: { name: name },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async delete(id) {
    try {
      return await prisma.Category.delete({
        where: { id: parseInt(id) },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = CategoryService;
