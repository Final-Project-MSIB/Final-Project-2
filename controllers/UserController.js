const { Users } = require("../models");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const user = await Users.create(req.body);

    return res.status(201).json({
      user: {
        email: user.email,
        full_name: user.full_name,
        username: user.username,
        profile_image_url: user.profile_image_url,
        age: user.age,
        phone_number: user.phone_number,
      },
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: error.errors[0].message });
    }
    return res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const data = await Users.findOne({
      where: { email },
    });

    if (!data) {
      return res.status(400).json({ error: "Email not found" });
    }

    const user = data.dataValues;

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(400).json({ error: "Wrong Password" });
    }

    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    const token = jsonwebtoken.sign(payload, process.env.JWT_SECRET);

    return res.status(200).json({ token });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: error.errors[0].message });
    }

    return res.status(500).json({ error: error.message });
  }
};

const modifyUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { email, full_name, username, profile_image_url, age, phone_number } =
      req.body;

    const myData = req.user;
    if (userId != myData.id) {
      return res.status(401).json({ error: "Cant modify other user" });
    }

    const updateData = await Users.update(
      {
        email,
        full_name,
        username,
        profile_image_url,
        age,
        phone_number,
      },
      {
        where: { id: userId },
      }
    );

    if (updateData[0] === 0) {
      return res.status(400).json({ error: "Modify failed" });
    }

    return res.status(200).json({
      user: {
        email,
        full_name,
        username,
        profile_image_url,
        age,
        phone_number,
      },
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: error.errors[0].message });
    }

    return res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;

  const myData = req.user;
  if (userId != myData.id) {
    return res.status(401).json({ error: "Cant modify other user" });
  }

  try {
    const deleteData = await Users.destroy({
      where: { id: userId },
    });

    if (deleteData === 0) {
      return res.status(400).json({ error: "Failed to delete" });
    }

    return res
      .status(200)
      .json({ message: "Your account has been successfully deleted" });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: error.errors[0].message });
    }

    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  modifyUser,
  deleteUser,
};
