const prisma = require("../lib/prisma");
const { verifyToken } = require("../lib/jwt");

const authentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) throw { name: "unAuthenticated", message: "User Unauthenticated" };

    const user = verifyToken(token);

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
    
  } catch (error) {
    next(error);
  }
};

const authorization = async (req, res, next) => {
  try {
    const role = req.user.role
    if (role === 'admin'){
      next();
    } else if (role === null || role !== 'admin'){
      throw { name: "unAuthorized", message: "User Unauthorized" };
    }else {
      throw { name: "notFound", message: "Data not Found" };
    }
    
    
  } catch (error) {
    next(error);
  }
};


module.exports = {authentication, authorization};
