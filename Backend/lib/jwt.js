const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "1h",
    algorithm: "HS256",
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.SECRET_KEY, {
      algorithms: ["HS256"],
    });
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

module.exports = { generateToken, verifyToken };
