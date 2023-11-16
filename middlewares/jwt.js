require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyToken = async (token) => {
  try {
    token = token.replace("Bearer ", "");
    const decode = await jwt.verify(token, process.env.JWT_SECRET);
    return decode;
  } catch (error) {
    throw {
      code: 401,
      message: "Unauthorized",
    };
  }
};

const authentication = async (req, res, next) => {
  try {
    let token = req.headers["authorization"] || req.headers["token"];
    if (!token) {
      res.status(401).json({
        message: "Unauthorized",
      });
    } else {
      if (token?.split(" ").length > 1) {
        token = token?.split(" ")?.[1];
      }
      const decode = await verifyToken(token);
      req.user = decode;
      next();
    }
  } catch (error) {
    res.status(error.code || 500).json(error);
  }
};

module.exports = { authentication };
