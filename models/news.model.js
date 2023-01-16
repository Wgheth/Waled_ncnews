const db  = require("../db/connection");

const readTopics = () => {
  return db.query("SELECT * FROM topics")
    .then((result) => {
     return result.rows;
    })
    .catch((err) => {
      console.log(err);
    });
};

const readArticles = (sort_by = 'created_at') => {

  const acceptedSorBy = ["created_at"];
  if (!acceptedSorBy.includes(sort_by)){
    return Promise.reject({status: 400, msg: 'Please sort by acceptable parameter'})
  }
  let countString =  `SELECT articles.article_id, articles.title, articles.topic, 
  articles.author, articles.body, articles.created_at, articles.votes, 
  articles.article_img_url,  COUNT(comments.body) AS comment_count
  FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
  GROUP BY articles.article_id ORDER BY ${sort_by} DESC;` 
  
  return db.query(countString)
    .then((result) => {
      console.log(result.rows);
    return result.rows;
    }).catch((err) => {
      console.log(err);
    });
};


module.exports = { readTopics, readArticles };