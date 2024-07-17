const MasterProductService = require("../services/masterProductService");

class MasterProductController {
    static async getListProduct (req,res,next) {
        try {
            const {page,limit} = req.query;
            const masterProduct = await MasterProductService.getListProduct({
                page,limit
            });
            res.status(200).json({
                message : 'Success',
                data : masterProduct
            })
        } catch(err) {
            next(err);
        }
    }

    static async getProductById (req,res,next) {
        try {
            const {id} = req.params;
            const product = await MasterProductService.getProductById(id);
            res.status(200).json({
                message : 'Success',
                data : product
            })
        } catch(err) {
            next(err);
        }
    }

    static async getProductByName (req,res,next) {
        try {
            const {name} = req.params;
<<<<<<< HEAD
            const product = await MasterProductService.getProductByName({name});
=======
            const product = await MasterProductService.getProductByName(name);

>>>>>>> cef8ccd1c95c8700a3622b115a1a7833ef65836d
            res.status(200).json({
                message : 'Success',
                data : product
            })
        } catch(err) {
            next(err);
        }
    }

    static async getProductByCategory (req,res,next) {
        try {
            const {name} = req.params;
            const product = await MasterProductService.getProductByCategory(name);
            res.status(200).json({
                message : 'Success',
                data : product
            })
        } catch(err) {
            next(err);
        }
    }

    static async createProduct (req,res,next) {
        try {
<<<<<<< HEAD
            const params = req.body;
            const product = await MasterProductService.createProduct(params);
            res.status(201).json({
                message : 'Master Product is Successfully Created',
                product
=======
            const image = req.file.path;
            const params = {...req.body,image};
            const product = await MasterProductService.createProduct(params);
            res.status(201).json({
                message : 'Master Product is Successfully Created',
                data : product
>>>>>>> cef8ccd1c95c8700a3622b115a1a7833ef65836d
            })
        } catch(err) {
            next(err);
        }
    }

    static async editProduct (req,res,next) {
        try {
            const {id} = req.params;
<<<<<<< HEAD
            const params = {...req.body, id};
=======
            const image = req.file.path;
            const params = {...req.body, id, image};
          
>>>>>>> cef8ccd1c95c8700a3622b115a1a7833ef65836d
            const product = await MasterProductService.editProduct(params);
            res.status(200).json({
                message : 'Master Produt is Successfully Updated',
                data : product
            })
        } catch(err) {
            next(err);
        }
    }

    static async deleteProduct (req,res,next) {
        try {
            const {id} = req.params;
            const product = await MasterProductService.deleteProduct(id);
            res.status(200).json({
                message : 'Master Product is Successfully Deleted',
                data : product
            })
        } catch(err) {
            next(err);
        }
    }

}

module.exports = MasterProductController;