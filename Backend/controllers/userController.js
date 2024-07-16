const UserService = require("../services/userService");

class UserController {

    static async getListUser (req,res,next) {
        try {
            const {page,limit} = req.query;
            const users = await UserService.getListUser({page,limit});
            res.status(200).json({
                message : 'Success',
                data : users
            })
        } catch(err) {
            next(err);
        }
    }

    static async getUserById (req,res,next) {
        try {
            const {id} = req.params;
            const user = await UserService.getUserById(id);
            res.status(200).json({
                message : 'Success',
                data : user
            })
        } catch(err) {  
            next(err);
        }
    }

    static async getOrderByUserId(req,res,next) {
        try{
            const {id} = req.params;
            const orderUser = await UserService.getOrderByUserId(id);

            res.status(200).json({
                message : 'Success',
                data : orderUser
            })
        } catch(err) {
            next(err);
        }
    }

    static async editUser (req,res,next) {
        try {
            const {id} = req.params;
            const image = req.file;
            const params = {...req.body,id, image};
            const user = await UserService.editUser(params);
            res.status(200).json({
                message : 'User is Succesfully Updated',
                data : user
            })
        } catch(err) {
            next(err);
        }
    }

    static async deleteUser (req,res,next) {
        try {
            const {id} = req.params;
            const user = await UserService.deleteUser(id);
            res.status(200).json({
                message : 'User is Succesfully Deleted',
                data : user
            })
        } catch(err) {
            next(err);
        }
    }

}

module.exports = UserController;