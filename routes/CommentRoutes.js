const express = require("express");
const router = express.Router();

const jwtMiddleware = require("../middlewares/jwt");

const CommentController = require("../controllers/CommentController");

router.post("/", jwtMiddleware.authentication, CommentController.createComment);
router.get("/", jwtMiddleware.authentication, CommentController.getComment);
router.put(
  "/:commentId",
  jwtMiddleware.authentication,
  CommentController.editComment
);
router.delete(
  "/:commentId",
  jwtMiddleware.authentication,
  CommentController.deleteComment
);

module.exports = router;
