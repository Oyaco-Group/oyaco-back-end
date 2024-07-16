const multer = require('multer');
const { multerMasterProduct, multerUser } = require('../middleware/multer');

const uploadHandlerMasterProduct = multer({
    storage : multerMasterProduct
})

const uploadHandlerUser = multer({
    storage : multerUser
})

module.exports = {
    uploadHandlerMasterProduct,
    uploadHandlerUser
};