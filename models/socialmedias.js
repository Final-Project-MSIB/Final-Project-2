"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SocialMedias extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SocialMedias.belongsTo(models.Users);
    }
  }
  SocialMedias.init(
    {
      name: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
      },
      social_media_url: {
        type: DataTypes.TEXT,
        validate: {
          notEmpty: true,
          isUrl: true,
        },
      },
      UserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "SocialMedias",
    }
  );
  return SocialMedias;
};
