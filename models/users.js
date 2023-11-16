"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Users.hasMany(models.Photos, { foreignKey: "UserId" });
    }
  }
  Users.init(
    {
      full_name: {
        type: DataTypes.STRING,
        validate: { notEmpty: true },
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true,
          notEmpty: true,
        },
        unique: true,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        validate: { notEmpty: true },
      },
      password: {
        type: DataTypes.STRING,
        validate: { notEmpty: true },
      },
      profile_image_url: {
        type: DataTypes.TEXT,
        validate: {
          isUrl: true,
          notEmpty: true,
        },
      },
      age: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: true,
          isInt: true,
          isNumeric: true,
        },
      },
      phone_number: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
          isInt: true,
          isNumeric: true,
        },
      },
    },
    {
      sequelize,
      modelName: "Users",
    }
  );
  Users.beforeSave((user, options) => {
    if (user.password) {
      user.password = bcrypt.hashSync(user.password, 10);
    }
  });
  return Users;
};
