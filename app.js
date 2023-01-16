const express = require("express");
const {
  getObjects,
  } = require("./controllers/news.controller");
const app = express();
app.use(express.json());


 app.get("/api/topics", getObjects);


module.exports = { app };