const express = require('express');
const UserController = require('../controllers/userController');
const { uploadHandlerUser } = require('../lib/uploadImage');


const router = express.Router();

router.get('/',UserController.getListUser);
router.get('/:id',UserController.getUserById);
router.put('/edit/:id',uploadHandlerUser.single('image'),UserController.editUser);
router.delete('/delete/:id',UserController.deleteUser);

router.get('/orderUser/:id',UserController.getOrderByUserId);



module.exports = router;