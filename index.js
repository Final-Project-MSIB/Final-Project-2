require("dotenv").config();

const db = require("./models/index");
const express = require("express");
const app = express();

const router = require("./routes/index");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

module.exports = app;
