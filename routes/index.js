const express = require("express");
const router = express.Router();

const UserRoutes = require("./UserRoutes");
const PhotoRoutes = require("./PhotoRoutes");
const CommentRoutes = require("./CommentRoutes");
const SocialMediaRoutes = require("./SocialMediaRoutes");

router.use("/users", UserRoutes);
router.use("/photos", PhotoRoutes);
router.use("/comments", CommentRoutes);
router.use("/socialmedias", SocialMediaRoutes);

module.exports = router;
