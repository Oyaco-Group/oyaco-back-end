const prisma = require("../lib/prisma");

class MasterProductService {
    static async getListProduct(params) {
        const{page,limit} = params;
        const skip = (page-1)*limit;
        const take = +limit;
        const masterProduct = await prisma.masterProduct.findMany({
            skip, 
            take,
            include : {
                category : {
                    select : {
                        name : true
                    }
                }
            }
        })
        return masterProduct;
    }

    static async getProductById(params) {
        const product = await prisma.masterProduct.findUnique({
            where : {
                id : +params
            }
        });
        return product;
    }

    static async getProductByName({params}) {
        const product = await prisma.masterProduct.findFirst({
            where : {params}
        })
        return product;
    }

    static async getProductByCategory(params) {
        const category = await prisma.category.findFirst({
            where : {
                name : params
            }
        });
        if(!category) throw({name : 'exist', message : 'Category is not Exist'});
        const product = await prisma.masterProduct.findMany({
            where : {
                category_id : +category.id
            }
        })
        return product;
    }

    static async createProduct(params) {
        const {
            name,
            sku,
            price,
            category_id,
            isdelete
        } = params;
        const existingProduct = await prisma.masterProduct.findFirst({
            where : {name}
        })
        if(existingProduct) throw({name : 'failedToCreate', message : 'Product has been Existed'});
        const isdeleteBoolean = isdelete === "true";
        const product = await prisma.masterProduct.create({
            data : {
                name,
                sku,
                price : price,
                isdelete : isdeleteBoolean,
                category : {
                    connect : {
                        id : +category_id
                    }
                }
            }
        })
        return product;
    }

    static async editProduct (params) {
        const {id} = params;
        const {name,
            category_id,
            price,
            sku,
            isdelete
        } = params;
        const isdeleteBoolean = isdelete === "true";
        const existingProduct = await prisma.masterProduct.findUnique({
            where : {
                id : +id
            }
        })
        if(!existingProduct) throw({name : 'failedToUpdate', message : 'Can not Update, product is Not Found'});
        const product = await prisma.masterProduct.update({
            where : {
                id : +id
            },
            data : {
                name,
                category_id : +category_id,
                price,
                sku,
                isdelete : isdeleteBoolean
            }
        })
        return product;
    }

    static async deleteProduct(params) {
        const product = await prisma.masterProduct.delete({
            where : {
                id : +params
            }
        })
        return product;
    }

}

module.exports = MasterProductService;