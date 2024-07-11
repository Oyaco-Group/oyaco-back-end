const path = require('path')
const multer = require('multer')

// engine storage untuk multer user
const multerUser = multer.diskStorage(
    {
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,"../assets/user"))
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  }
)

const multerMasterProduct = multer.diskStorage(
    {
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,"../assets/masterProduct"))
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  }
)

module.exports = {multerUser, multerMasterProduct}