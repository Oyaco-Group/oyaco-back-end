const ProductMovementService = require(" ../services/productMovement.js");

class ProductMovementController {
    static async getListProductMovement(req, res, next){
        try {
            const {page,limit} = req.query;
            const productmovements = await ProductMovementService.getListProductMovements(
                {page,limit}
            );
            res.status(200).json({
                message: "Success",
                status: 200,
                data: productmovements,
            });
        } catch (err) {
          next(err);
        }          
    }

    static async getProductMovementById (req, res, next){
        try {
            const {id} = req.params;
            const productMovement = await ProductMovementService.getProductMovementById(id);
            res.status(200).json({
                message : "Success",
                data: productMovement
            })
        } catch (err) {
          next(err);
        }
    }

    static async createProductMovement (req,res, next){
        try{
            const params = req.body;
            const productMovement = ProductMovementService.createProductMovement(params);
            res.status(201).json({
                message : "Product Movement Successfully Created",
                productMovement
            })
        } catch (err) {
            next(err);
        }
    }

    static async editProductMovement (req, res, next){
        try {
            const { id } = req.params;
            const {
                master_product_id,
                movement_type,
                quantity,
                expiration_date,
                destination,
                iscondition_good,
                origin,
                user_id,
                inventory_id
            } = req.body;

            const editProductMovement = await ProductMovementService.editProductMovement({
                id,
                master_product_id,
                movement_type,
                quantity,
                expiration_date,
                destination,
                iscondition_good,
                origin,
                user_id,
                inventory_id
            });
            res.status(200).json({
                message: "Product Movement updated",
                status: 200,
                data: editProductMovement,
              });

       }  catch (err) {
            next(err);
        }
    }

    static async deleteProductMovement(req, res, next) {
            try {
              const { id } = req.params;
        
              const productMovement = await ProductMovementService.delete(id);
        
              res.status(200).json({
                message: "Product Movement deleted",
                data: productMovement,
              });
            } catch (err) {
              next(err);
            }
          }
    
}
module.export = ProductMovementController;