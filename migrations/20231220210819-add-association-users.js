"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    // Unique email
    await queryInterface.addConstraint("Users", {
      fields: ["email"],
      type: "unique",
      name: "UNIQUE_USERS_EMAIL",
    });

    // Unique username
    await queryInterface.addConstraint("Users", {
      fields: ["username"],
      type: "unique",
      name: "UNIQUE_USERS_USERNAME",
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    // Remove unique email
    await queryInterface.removeConstraint("Users", "UNIQUE_USERS_EMAIL");

    // Remove unique username
    await queryInterface.removeConstraint("Users", "UNIQUE_USERS_USERNAME");
  },
};
