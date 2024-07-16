const multer = require('multer');

const multerErrorHandler = (err,req,res,next) => {
    console.log(err);

    if (err instanceof multer.MulterError) {
        res.status(413).json({ error: err.message });
      } else {
        next(err);
    }
}

module.exports = multerErrorHandler;