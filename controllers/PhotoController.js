const { Photos, Users, Comments } = require("../models");

const registerPhoto = async (req, res) => {
  try {
    const { poster_image_url, title, caption } = req.body;

    const UserId = req.user.id;

    const data = {
      poster_image_url,
      title,
      caption,
      UserId: UserId,
    };

    const createPhoto = await Photos.create(data);

    return res.status(201).json({
      id: createPhoto.id,
      poster_image_url: createPhoto.poster_image_url,
      title: createPhoto.title,
      caption: createPhoto.caption,
      UserId: createPhoto.UserId,
    });
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: err.errors[0].message,
      });
    }

    return res.status(500).json({
      message: err.message,
    });
  }
};

const getPhoto = async (req, res) => {
  try {
    const userId = req.user.id;
    const photos = await Photos.findAll({
      where: {
        UserId: userId,
      },
      include: [
        {
          model: Comments,
          as: "Comments",
          attributes: {
            exclude: ["UserId", "PhotoId", "id", "updatedAt", "createdAt"],
          },
          include: [
            {
              model: Users,
              as: "User",
              attributes: {
                exclude: [
                  "id",
                  "profile_image_url",
                  "full_name",
                  "email",
                  "age",
                  "password",
                  "phone_number",
                  "createdAt",
                  "updatedAt",
                ],
              },
            },
          ],
        },
        {
          model: Users,
          as: "User",
          attributes: {
            exclude: [
              "full_name",
              "email",
              "age",
              "password",
              "phone_number",
              "createdAt",
              "updatedAt",
            ],
          },
        },
      ],
    });

    return res.status(200).json({
      photos,
    });
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: err.errors[0].message,
      });
    }

    return res.status(500).json({
      message: err.message,
    });
  }
};

const updatePhoto = async (req, res) => {
  const { photoId } = req.params;
  const { poster_image_url, title, caption } = req.body;

  try {
    const photoData = await Photos.findOne({
      where: {
        id: photoId,
      },
    });

    if (!photoData) {
      return res.status(404).json({
        message: "Photo not found",
      });
    }

    const UserId = req.user.id;

    if (photoData.UserId !== UserId) {
      return res.status(401).json({
        message: "You are not authorized to edit this photo",
      });
    }

    const updateData = await Photos.update(
      {
        poster_image_url,
        title,
        caption,
      },
      {
        where: {
          id: photoId,
        },
      }
    );

    if (updateData[0] === 0) {
      return res.status(400).json({
        message: "Update failed",
      });
    }

    const photo = await Photos.findOne({
      where: {
        id: photoId,
      },
    });

    return res.status(200).json({ photo });
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: err.errors[0].message,
      });
    }

    return res.status(500).json({
      message: err.message,
    });
  }
};

const deletePhoto = async (req, res) => {
  const { photoId } = req.params;

  try {
    const photoData = await Photos.findOne({
      where: {
        id: photoId,
      },
    });

    if (!photoData) {
      return res.status(404).json({
        message: "Photo not found",
      });
    }

    const UserId = req.user.id;

    if (photoData.UserId !== UserId) {
      return res.status(401).json({
        message: "You are not authorized to edit this photo",
      });
    }

    await Photos.destroy({
      where: {
        id: photoId,
      },
    });

    return res.status(200).json({
      message: "Your photo has been successfully deleted",
    });
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: err.errors[0].message,
      });
    }

    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  registerPhoto,
  getPhoto,
  updatePhoto,
  deletePhoto,
};
