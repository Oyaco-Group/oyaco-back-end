const express = require('express');
const UserController = require('../controllers/userController');


const router = express.Router();

router.get('/',UserController.getListUser);
router.get('/:id',UserController.getUserById);
router.put('/edit/:id',UserController.editUser);
router.delete('/delete/:id',UserController.deleteUser);

router.get('/orderUser/:id',UserController.getOrderByUserId);



module.exports = router;