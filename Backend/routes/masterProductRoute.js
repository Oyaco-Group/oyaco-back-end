const express = require('express');
const MasterProductController = require('../controllers/masterProductController');
const { uploadHandlerMasterProduct } = require('../lib/uploadImage');

const router = express.Router();

router.get('/',MasterProductController.getListProduct);
router.get('/:id',MasterProductController.getProductById);
router.get('/name/:name',MasterProductController.getProductByName);
router.get('/category/:name',MasterProductController.getProductByCategory);
router.post('/add',uploadHandlerMasterProduct.single('image'),MasterProductController.createProduct);
router.put('/edit/:id',uploadHandlerMasterProduct.single('image'),MasterProductController.editProduct);
router.delete('/delete/:id', MasterProductController.deleteProduct);

module.exports = router; 