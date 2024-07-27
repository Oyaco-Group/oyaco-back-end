const prisma = require("../lib/prisma");
const { verifyToken } = require("../lib/jwt");

const authentication = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: parseInt(decoded.id, 10) },
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

const authorization = (req, res, next) => {
  try {
    const { role } = req.user;
    if (role === "admin") {
      return next();
    } else if (role === null || role !== "admin") {
      throw { name: "unAuthorized", message: "User Unauthorized" };
    } else {
      return res
        .status(403)
        .json({ message: "Forbidden: User not authorized" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { authentication, authorization };
