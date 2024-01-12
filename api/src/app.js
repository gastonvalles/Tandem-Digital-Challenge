const express = require("express");
const config = require("./config");
const cors = require("cors");

const app = express();

app.set("port", config.port);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

module.exports = app;