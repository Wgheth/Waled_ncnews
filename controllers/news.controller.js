const {
  readTopics, readArticles, readArticlesID, readComments } = require("../models/news.model");
  
  const getObjects = (req, res, next) => {
    readTopics().then((topics) => {
      res.status(200).send(topics);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
  };
  

  const getArticles = (req, res, next) => {
    readArticles().then((articles) => {
      res.status(200).send(articles);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
  };

  const getArticlesID = ( req, res, next) => {
    const { id } = req.params
     
    readArticlesID(id).then((article) => {
    res.status(200).send(article);
    })
    .catch((err)=>{
   
      next(err)
    }) 
  }

  const getComments = (req, res, next) => {
  
    readComments(req)
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch((err) => {
      next(err);
    });
  }
 module.exports = {  getObjects, getArticles, getArticlesID, getComments };