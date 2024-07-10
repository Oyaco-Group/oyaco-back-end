const prisma = require("../lib/prisma");
const { verifyToken } = require("../lib/jwt");

const authentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) throw { name: "Unauthicated" };

    const user = await verifyToken(token);

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

module.exports = authentication;
