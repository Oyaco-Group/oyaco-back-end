const multer = require('multer');
const { multerMasterProduct, multerUser } = require('../middleware/multer');

const uploadHandlerMasterProduct = multer({
    storage : multerMasterProduct,
    limits : {fileSize : 10000000}
})

const uploadHandlerUser = multer({
    storage : multerUser,
    limits : {fileSize : 10000000}
})

module.exports = {
    uploadHandlerMasterProduct,
    uploadHandlerUser
};