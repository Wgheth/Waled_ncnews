const {
  readTopics, readArticles, readArticlesID, readComments, addComment,
   updateVotes, getUsersArr, removeComment  } = require("../models/news.model");
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
      .then((comment) => {
        res.status(201).send(comment);
      })
      .catch((err) => {
       
        next(err);
      });
  };

  function patchArticle (req, res, next) {
    updateVotes(req)
   .then((votes) => {
    res.status(200).send(votes);
   })
   .catch((err) => {
    
     next(err);
   });
  }

  function getUsers(req, res, next) {
    getUsersArr(req)
      .then((user) => {
        res.status(200).send(user);
      })
      .catch((err) => {
        
        next(err);
      });
  }

  const deleteComment = (req, res,next) => {
    const { id } = req.params
     removeComment(id).then(()=>{
      res.sendStatus(204)
     }).catch((err) => {
        
      next(err);
    });
  }
  module.exports = {  getObjects, getArticles, 
    getArticlesID, getComments, postComment, patchArticle, getUsers, deleteComment };