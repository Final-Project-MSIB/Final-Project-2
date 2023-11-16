require("dotenv").config();

const db = require("./models/index");
const express = require("express");
const app = express();

const router = require("./routes/index");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("App Listening on port " + port);
});
