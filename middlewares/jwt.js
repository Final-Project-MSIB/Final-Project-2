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
    const token = req.headers["authorization"];

    if (!token) {
      res.status(401).json({
        message: "Unauthorized",
      });
    } else {
      const decode = await verifyToken(token?.split(" ")?.[1]);
      req.user = decode;
      next();
    }
  } catch (error) {
    res.status(error.code || 500).json(error);
  }
};

module.exports = { authentication };
