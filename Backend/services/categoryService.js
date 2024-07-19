const prisma = require("../lib/prisma");

class CategoryService {
  static async getListCategories() {
    const categories = await prisma.category.findMany();
    if (!categories)
      throw {
        name: "failedToRetrieve",
        message: "Failed to retrieve categories",
      };
    return categories;
  }

  static async create(name) {
    const existingCategory = await prisma.category.findFirst({
      where: { name },
    });
    if (existingCategory)
      throw { name: "exist", message: "Category already exists" };

    const newCategory = await prisma.category.create({
      data: { name: name },
    });
    if (!newCategory)
      throw { name: "failedToCreate", message: "Failed to create category" };
    return newCategory;
  }

  static async edit(id, name) {
    const existingCategory = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingCategory)
      throw {
        name: "failedToUpdate",
        message: "Update is failed, no existing category",
      };

    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name: name },
    });
    if (!updatedCategory)
      throw { name: "failedToUpdate", message: "Failed to update category" };
    return updatedCategory;
  }

  static async delete(id) {
    const existingCategory = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingCategory)
      throw {
        name: "failedToDelete",
        message: "Delete is failed, no existing category",
      };

    const deletedCategory = await prisma.category.delete({
      where: { id: parseInt(id) },
    });
    if (!deletedCategory)
      throw { name: "failedToDelete", message: "Failed to delete category" };
    return deletedCategory;
  }
}

module.exports = CategoryService;