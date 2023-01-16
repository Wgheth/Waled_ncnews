const {
  readTopics, readArticles } = require("../models/news.model");
  
  const getObjects = (req, res, next) => {
    readTopics().then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
  };
  

  const getarticles = (req, res, next) => {
    readArticles().then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
  };
 module.exports = {  getObjects, getarticles };