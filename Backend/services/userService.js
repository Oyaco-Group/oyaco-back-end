const { hashPassword } = require('../lib/bcrypt');
const prisma = require('../lib/prisma');
const fs = require('fs');
const {promisify} = require('util');
const unlinkAsync = promisify(fs.unlink);

class UserService {

    static async getListUser(params) {
        const {page,limit} = params;
        const skip = (page-1)*limit;
        const take = +limit;
        const users = await prisma.user.findMany({
            skip, take,
            select : {
                id : true,
                name : true,
                email : true,
                address : true
            }
        });
        return users;
    }

    static async getUserById(params) {
        const user = await prisma.user.findUnique({
            where : {
                id : +params
            },
            select : {
                id : true,
                name : true,
                email : true,
                address : true,
                user_role : true,
                image_url : true
            }
        })
        return user;
    }

    static async getOrderByUserId(params) {
        const order = await prisma.user.findUnique({
            where : {
                id : +params
            },
            select : {
                id : true,
                name : true,
                email : true,
                address : true,
                order : true
            }
        })
        return order;
    }

    static async editUser(params) {
        const {id,name,email,password,address,user_role,isdelete,image} = params;
        const isdeleteBoolean = (isdelete === "true");
        let image_url;
        const existingUser = await prisma.user.findUnique({
            where : {
                id : +id
            }
        })
        if(!image) {
            image_url = null;

            if(!existingUser) {
                throw({name : 'failedToUpdate', message : 'Update is Failed, No Existing User'});
            }
            if(!name || !email || !password || !address || !user_role || !isdelete) {
                throw({name : 'failedToUpdate', message : 'Please Input Every Field in Form'});
            }
        } else {
            image_url = image.path;

            if(!existingUser) {
                await unlinkAsync(image_url);
                throw({name : 'failedToUpdate', message : 'Update is Failed, No Existing User'});
            }
            if(!name || !email || !password || !address || !user_role || !isdelete) {
                await unlinkAsync(image_url);
                throw({name : 'failedToUpdate', message : 'Please Input Every Field in Form'});
            }
            if(existingUser.image_url) {
                await unlinkAsync(existingUser.image_url);
            }
        }

        const hashedPassword = hashPassword(password);
        const user = await prisma.user.update({
            where : {
                id : +id
            },
            data : {
                name,email,address,user_role,
                image_url,
                password : hashedPassword,
                isdelete : isdeleteBoolean
            },
            select : {
                id : true,
                name : true,
                email : true,
                address : true
            }
        })
        return user;
    }

    static async deleteUser(params) {
        const user = await prisma.user.delete({
            where : {
                id : +params
            },
            select : {
                id : true,
                name : true,
                email : true,
                address : true
            }
        })
        return user;
    }



}


module.exports = UserService;