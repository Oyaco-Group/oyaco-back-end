const ProductMovementService = require(" ../services/productMovement.js");

class ProductMovementsController {
    static async getListProductMovements(req, res){
        try {
            const productmovements = await ProductMovementService.getListProductMovements();
            res.status(200).json({
                message: "Sucess",
                status: 200,
                data: productmovements,
            });
        } catch (error) {
          console.log(error);
          res.status(500).json({
            message: "Error retrieving peoduct movements",
            status: 500,
            error: error.message,
          });  
            
        }
    }
}