const { Photos, Users, Comments, SocialMedias } = require("../models");

const deleteSocialMedia = async (req, res) => {
  const { socialMediaId } = req.params;
  try {
    const findSocialMedia = await SocialMedias.findOne({
      where: {
        id: socialMediaId,
      },
    });

    if (!findSocialMedia) {
      return res.status(404).json({
        message: "Social Media Not Found",
      });
    }

    const UserId = req.user.id;

    if (findSocialMedia.UserId !== UserId) {
      return res.status(401).json({
        message: "You are not authorized to delete this social media",
      });
    }

    await findSocialMedia.destroy();

    return res.status(200).json({
      message: "Your social media has been successfully deleted",
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

const updateSocialMedia = async (req, res) => {
  const { socialMediaId } = req.params;
  try {
    const findSocialMedia = await SocialMedias.findOne({
      where: {
        id: socialMediaId,
      },
    });

    if (!findSocialMedia) {
      return res.status(404).json({
        message: "Social Media Not Found",
      });
    }

    const UserId = req.user.id;

    if (findSocialMedia.UserId !== UserId) {
      return res.status(401).json({
        message: "You are not authorized to edit this social media",
      });
    }

    const { name, social_media_url } = req.body;

    findSocialMedia.name = name;
    findSocialMedia.social_media_url = social_media_url;

    await findSocialMedia.save();

    return res.status(200).json({
      social_media: findSocialMedia,
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

const getSocialMedia = async (req, res) => {
  try {
    const social_medias = await SocialMedias.findAll({
      where: {
        UserId: req.user.id,
      },
      include: [
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
      social_medias,
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

const createSocialMedia = async (req, res) => {
  const { name, social_media_url } = req.body;
  try {
    const UserId = req.user.id;
    const socialMedia = await SocialMedias.create({
      name,
      social_media_url,
      UserId,
    });

    return res.status(201).json({
      social_media: socialMedia,
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
  createSocialMedia,
  getSocialMedia,
  updateSocialMedia,
  deleteSocialMedia,
};
