const express = require("express");
const router = express.Router();

const jwtMiddleware = require("../middlewares/jwt");
const SocialMediaController = require("../controllers/SocialMediaController");

router.post(
  "/",
  jwtMiddleware.authentication,
  SocialMediaController.createSocialMedia
);
router.get(
  "/",
  jwtMiddleware.authentication,
  SocialMediaController.getSocialMedia
);
router.put(
  "/:socialMediaId",
  jwtMiddleware.authentication,
  SocialMediaController.updateSocialMedia
);
router.delete(
  "/:socialMediaId",
  jwtMiddleware.authentication,
  SocialMediaController.deleteSocialMedia
);

module.exports = router;
