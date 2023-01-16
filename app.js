const express = require("express");
const {
  getObjects, getarticles,
  } = require("./controllers/news.controller");
const app = express();
app.use(express.json());

app.get("/", (request, response) => {
  response.status(404);
});

 app.get("/api/topics", getObjects);
 app.get("/api/articles", getarticles);


module.exports = { app };