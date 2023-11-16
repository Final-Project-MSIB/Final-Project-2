const { Photos, Users, Comments } = require("../models");

const editComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const UserId = req.user.id;

    const findComment = await Comments.findOne({
      where: {
        id: commentId,
      },
    });

    if (!findComment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (findComment.UserId !== UserId) {
      return res.status(403).json({
        message: "You are not authorized to edit this comment",
      });
    }

    findComment.comment = req.body.comment;
    await findComment.save();

    return res.status(200).json({
      comment: findComment,
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

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const UserId = req.user.id;

    const findComment = await Comments.findOne({
      where: {
        id: commentId,
      },
    });

    if (!findComment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (findComment.UserId !== UserId) {
      return res.status(403).json({
        message: "You are not authorized to delete this comment",
      });
    }

    await findComment.destroy();

    return res.status(200).json({
      message: "Your comment has been successfully deleted",
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

const getComment = async (req, res) => {
  try {
    const UserId = req.user.id;
    const comments = await Comments.findAll({
      where: {
        UserId: UserId,
      },
      include: [
        {
          model: Photos,
          as: "Photo",
          attributes: {
            exclude: ["UserId", "createdAt", "updatedAt"],
          },
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
              "createdAt",
              "updatedAt",
            ],
          },
        },
      ],
    });

    return res.status(200).json({
      comments,
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

const createComment = async (req, res) => {
  const { comment, PhotoId } = req.body;

  try {
    const findPhoto = await Photos.findOne({
      where: {
        id: PhotoId,
      },
    });

    if (!findPhoto) {
      return res.status(404).json({
        message: "Photo not found",
      });
    }

    const UserId = req.user.id;

    const commentCreate = await Comments.create({
      UserId: UserId,
      PhotoId: PhotoId,
      comment,
    });

    return res.status(201).json({
      comment: {
        id: commentCreate.id,
        comment: commentCreate.comment,
        UserId: commentCreate.UserId,
        PhotoId: commentCreate.PhotoId,
        updatedAt: commentCreate.updatedAt,
        createdAt: commentCreate.createdAt,
      },
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
  editComment,
  createComment,
  deleteComment,
  getComment,
};
