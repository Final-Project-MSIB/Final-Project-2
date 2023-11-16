const express = require("express");
const router = express.Router();

const jwtMiddleware = require("../middlewares/jwt");

const PhotoController = require("../controllers/PhotoController");

router.get("/", jwtMiddleware.authentication, PhotoController.getPhoto);
router.post("/", jwtMiddleware.authentication, PhotoController.registerPhoto);
router.put(
  "/:photoId",
  jwtMiddleware.authentication,
  PhotoController.updatePhoto
);
router.delete(
  "/:photoId",
  jwtMiddleware.authentication,
  PhotoController.deletePhoto
);

module.exports = router;
