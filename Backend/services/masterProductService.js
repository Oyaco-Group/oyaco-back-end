const { default: slugify } = require("slugify");
const prisma = require("../lib/prisma");
const slug = require("slugify");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

class MasterProductService {
  static async getListProduct(params) {
    const { page, limit } = params;
    const skip = (page - 1) * limit;
    const take = +limit;
    const masterProduct = await prisma.masterProduct.findMany({
      skip,
      take,
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });
    const numberProduct = await prisma.masterProduct.count();
    const totalPages = Math.ceil(numberProduct / limit);
    return { masterProduct, totalPages };
  }

  static async getProductById(params) {
    const product = await prisma.masterProduct.findUnique({
      where: {
        id: +params,
      },
    });
    return product;
  }

  static async getProductByName(params) {
    const lowerCaseName = params.toLowerCase();
    const slug = slugify(lowerCaseName, "-");
    const product = await prisma.masterProduct.findMany({
      where: {
        slugify: {
          contains: slug,
        },
      },
    });
    return product;
  }

  static async getProductByCategory(params) {
    const category = await prisma.category.findFirst({
      where: {
        name: params,
      },
    });
    if (!category) throw { name: "exist", message: "Category is not Exist" };
    const product = await prisma.masterProduct.findMany({
      where: {
        category_id: +category.id,
      },
    });
    return product;
  }

  static async createProduct(params) {
    const { name, image, sku, price, category_id, isdelete } = params;
    const image_url = !image ? "no-image.jpg" : image.filename;

    const imagePath = !image ? null : image.path;

    const category = await prisma.category.findUnique({
      where: { id: +category_id },
    });

    const existingProduct = await prisma.masterProduct.findFirst({
      where: { name },
    });
    if (existingProduct) {
      if (imagePath) await unlinkAsync(imagePath);
      throw { name: "failedToCreate", message: "Product has been Existed" };
    }
    const existingSKU = await prisma.masterProduct.findUnique({
      where: { sku },
    });
    if (existingSKU) {
      if (imagePath) await unlinkAsync(imagePath);
      throw { name: "failedToCreate", message: "SKU has been Existed" };
    }

    if (!category) {
      if (imagePath) await unlinkAsync(imagePath);
      throw { name: "failedToCreate", message: "Category does not exist" };
    }

    const isdeleteBoolean = isdelete === "true";
    const lowerCaseName = name.toLowerCase();
    const slugify = slug(lowerCaseName, "-");

    const product = await prisma.masterProduct.create({
      data: {
        name,
        image: image_url,
        sku,
        price,
        isdelete: isdeleteBoolean,
        slugify,
        category: {
          connect: {
            id: +category_id,
          },
        },
      },
    });
    return product;
  }

  static async editProduct(params) {
    const { id, name, image, category_id, price, sku, isdelete } = params;
    const imageFilename = !image ? null : image.filename;
    const imagePath = !image ? null : image.path;

    let image_url;
    const isdeleteBoolean = isdelete === "true";
    const lowerCaseName = name.toLowerCase();
    const slugify = slug(lowerCaseName, "-");

    const existingProductId = await prisma.masterProduct.findUnique({
      where: { id: +id },
    });

    if (!existingProductId) {
      if (imagePath) await unlinkAsync(imagePath);
      throw {
        name: "failedToUpdate",
        message: "Cannot update, product not found",
      };
    }

    const category = await prisma.category.findUnique({
      where: { id: +category_id },
    });

    if (!category) {
      if (imagePath) await unlinkAsync(imagePath);
      throw { name: "failedToUpdate", message: "Category does not exist" };
    }

    // Check if another product already has the updated name
    if (name !== existingProductId.name) {
      const existingProductWithName = await prisma.masterProduct.findFirst({
        where: { name },
      });
      if (existingProductWithName) {
        if (imagePath) await unlinkAsync(imagePath);
        throw {
          name: "failedToUpdate",
          message: "Product name already exists",
        };
      }
    }

    // Check if another product already has the updated SKU
    if (sku !== existingProductId.sku) {
      const existingProductWithSKU = await prisma.masterProduct.findUnique({
        where: { sku },
      });
      if (existingProductWithSKU) {
        if (imagePath) await unlinkAsync(imagePath);
        throw { name: "failedToUpdate", message: "Product SKU already exists" };
      }
    }

    // Remove old image if it's different from the new one
    if (
      existingProductId.image &&
      existingProductId.image !== "no-image.jpg" &&
      imageFilename &&
      imageFilename !== existingProductId.image
    ) {
      await unlinkAsync(`assets/masterProduct/${existingProductId.image}`);
    }

    // Determine the image URL to save
    if (!imageFilename) {
      image_url = existingProductId.image || "no-image.jpg";
    } else {
      image_url = imageFilename;
    }

    // Perform the update operation
    const updatedProduct = await prisma.masterProduct.update({
      where: { id: +id },
      data: {
        name,
        image: image_url,
        category_id: +category_id,
        price,
        sku,
        slugify,
        isdelete: isdeleteBoolean,
      },
    });

    return updatedProduct;
  }

  static async deleteProduct(params) {
    const existingProduct = await prisma.masterProduct.findUnique({
      where: {
        id: +params,
      },
    });
    if (!existingProduct)
      throw {
        name: "failedToDelete",
        message: "Can not Delete, Product is Not Found",
      };
    // await unlinkAsync(existingProduct.image);
    const inventory = await prisma.inventory.findMany({
      where: {
        master_product_id: +params,
      },
    });

    const checkDelete = (arr) => {
      let deleteArray = [];
      for (const obj of arr) {
        if (obj.quantity === 0) {
          deleteArray.push(true);
        } else {
          deleteArray.push(false);
        }
      }
      const decisionDelete = deleteArray.every((check) => check === true);

      return decisionDelete;
    };

    const decisionDelete = checkDelete(inventory);

    if (decisionDelete) {
      const product = await prisma.masterProduct.delete({
        where: {
          id: +params,
        },
      });
      return product;
    }

    return "There is still some Inventory left";
  }
}

module.exports = MasterProductService;
