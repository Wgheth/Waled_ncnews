const {
  readTopics } = require("../models/news.model");
  
  const getObjects = (req, res, next) => {
    readTopics().then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
  };
  
 module.exports = {  getObjects };