const express = require("express");

  const {
    getObjects, getArticles, getArticlesID, getComments, postComment, patchArticle, getUsers
    } = require("./controllers/news.controller");
const app = express();
app.use(express.json());

 app.get("/api/topics", getObjects);
 app.get("/api/articles", getArticles);
 app.get("/api/articles/:id", getArticlesID);
 app.get("/api/articles/:article_id/comments", getComments);
 app.post("/api/articles/:article_id/comments", postComment);
 app.patch(`/api/articles/:article_id`, patchArticle);
 app.get("/api/users", getUsers);

 

app.use((err, req, res, next) => {
  if (err.status && err.msg){
    res.status(err.status).send({msg: err.msg});
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === '23503'){
    res.status(400).send({msg: "User does not exist"});
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === '22P02'){
    res.status(400).send({msg: "Invalid id"});
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