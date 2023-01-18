const {
  readTopics, readArticles, readArticlesID, readComments, addComment,  } = require("../models/news.model");
  
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

  const postComment = (req, res, next) => {
    
    addComment(req)
      .then((data) => {
        res.status(201).send(data);
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  };
 module.exports = {  getObjects, getArticles, getArticlesID, getComments, postComment };