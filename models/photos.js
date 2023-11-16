"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Photos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Photos.belongsTo(models.Users, { foreignKey: "UserId" });
      Photos.hasMany(models.Comments, { foreignKey: "PhotoId" });
    }
  }
  Photos.init(
    {
      title: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
      },
      caption: {
        type: DataTypes.TEXT,
        validate: {
          notEmpty: true,
        },
      },
      poster_image_url: {
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
      modelName: "Photos",
    }
  );
  return Photos;
};
