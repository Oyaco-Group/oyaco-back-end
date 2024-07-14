const prisma = require("../lib/prisma");

class ProductMovementService {
    static async CreateProductMovement(data){
        const {
            master_product_id,
            movement_type,
            quantity,
            expiration_date,
            arrival_date,
            iscondition_good,
            origin,
            user_id,
            inventory_id
        } = data;
        
        const productMovement = await prisma.productMovement.create({
            master_product_id,
            movement_type,
            quantity,
            expiration_date,
            arrival_date,
            iscondition_good,
            origin,
            user_id,
            inventory_id
        });
        return productMovement;    
    }

    static async getAllProductMovement(page) {
        const limit = 5;
        const skip = (page - 1) * limit;
        const productMovement = await prisma.productMovement.findMany({
          take: limit,
          skip: skip,
        });
    
        return productMovement;
      }

      static async getProductMovementById(id) {
        const productMovement = await prisma.productMovement.findUnique({
          where: { id: parseInt(id) },
        });
    
        if (!inventory) {
          throw { name: "notFound", message: "No stock found" };
        }
    
        return productMovement;
      }

      static async editProductMovement(params) {
        const {
          id,
          master_product_id,
          movement_type,
          quantity,
          expiration_date,
          arrival_date,
          iscondition_good,
          origin,
          user_id,
          inventory_id
        } = params;
    
        const productMovementExist = await prisma.productMovement.findUnique({
          where: {
            id: parseInt(id),
          },
        });
    
        if (!productMovementExist) {
          throw { name: "failedToUpdate", message: "Edit failed" };
        }
    
        const productMovement = await prisma.productMovement.update({
          where: { id: parseInt(id) },
          data: {
            master_product_id : master_product_id,
            movement_type : movement_type,
            quantity : quantity,
            expiration_date : expiration_date,
            arrival_date : arrival_date,
            iscondition_good : iscondition_good,
            origin : origin,
            user_id : user_id,
            inventory_id : inventory_id
          },
        });
    
        return productMovement;
      }

      static async deleteProductMovement(id) {
        const productMovement = await prisma.productMovement.delete({
          where: { id: parseInt(id) },
        });
    
        const productMovementExist = await prisma.productMovement.findUnique({
          where: {
            id: parseInt(id),
          },
        });
    
        if (!productMovementExist) {
          throw { name: "failedToDelete", message: "Delete failed" };
        }
        return productMovement;
    }
    

}
module.exports = ProductMovementService;