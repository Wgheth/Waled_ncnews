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

const readArticles = () => {


  let countString =  `SELECT articles.article_id, articles.title, articles.topic, 
  articles.author, articles.body, articles.created_at, articles.votes, 
  articles.article_img_url,  COUNT(comments.body) AS comment_count
  FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
  GROUP BY articles.article_id ORDER BY articles.created_at DESC;` 
  
  return db.query(countString)
    .then((result) => {
    return result.rows;
    }).catch((err) => {
      console.log(err);
    });
};

const readArticlesID = (id) =>{
  return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
    .then((result) => {
      console.log(result.rows);
      if (result.rows.length === 0){
        return Promise.reject({status: 404, msg: "Article not found"});
      } else{
        let finalObj = {};

      for(let i = 0; i < result.rows.length; i++ ) {
        Object.assign(finalObj, result.rows[i]);
      }
     
      return finalObj
      }
      })
    

 

}

const readComments = (req) =>{
  const { article_id } = req.params;
  
  return db
    .query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;",
      [article_id]
    )
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err);
    });

}



module.exports = { readTopics, readArticles, readArticlesID, readComments };
