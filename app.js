
const express = require("express");
const {
  getObjects, getArticles, getArticlesID, getComments,
  } = require("./controllers/news.controller");
const app = express();

 app.get("/api/topics", getObjects);
 app.get("/api/articles", getArticles);
 app.get("/api/articles/:id", getArticlesID);
 app.get("/api/articles/:article_id/comments", getComments);

 

app.use((err, req, res, next) => {
  if (err.status && err.msg){
    res.status(err.status).send({msg: err.msg});
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({msg: "server error"});
});
app.use((req, res, next) => {
  res.status(404).send({msg: "Path not found"});
});

module.exports = { app };