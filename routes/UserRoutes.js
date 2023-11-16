const express = require("express");
const router = express.Router();

const jwtMiddleware = require("../middlewares/jwt");

const UserController = require("../controllers/UserController");

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.put("/:userId", jwtMiddleware.authentication, UserController.modifyUser);
router.delete(
  "/:userId",
  jwtMiddleware.authentication,
  UserController.deleteUser
);

module.exports = router;
