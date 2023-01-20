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

const readArticles = ((req, sortBy = "created_at", order = "DESC")=>{
  const { topic } = req.query;

  if (!topic){ 
  let countString =  `SELECT articles.article_id, articles.title, articles.topic, 
  articles.author, articles.body, articles.created_at, articles.votes, 
  articles.article_img_url,  COUNT(comments.body) AS comment_count
  FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
  GROUP BY articles.article_id ORDER BY ${sortBy}  ${order};` 
  return db
      .query(countString)
      .then((result) => {
        return result.rows;
      })
      
  } else if (topic) {
    return db
      .query(
        `SELECT * FROM articles WHERE topic = $1 ORDER BY ${sortBy} ${order}; `,
        [topic]
      )
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({ status: 404, msg: "Path not found" });
        } else {
          return result.rows;
        }
      });
  } 
});
const readArticlesID = (id) =>{
  return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
    .then((result) => {
      
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
      
      if (result.rows.length === 0){
        return Promise.reject({status: 404, msg: "Article not found"});
      } else{
      return result.rows;
      }
   
    })

}

function addComment(req) {
  const { article_id } = req.params;
  const {username, body} = req.body[0]
 
  if( username === undefined || body === undefined){
    return Promise.reject({ status: 400, msg: "Missing properties" });
  } else
  return db
    .query(
      "INSERT INTO comments (body, author, article_id, votes)VALUES($1,$2,$3,$4) RETURNING *;",
      [req.body[0]["body"], req.body[0]["username"], article_id, 0]
    )
    .then((result) => {
    
    let finalObj = {};

    for(let i = 0; i < result.rows.length; i++ ) {
        Object.assign(finalObj, result.rows[i]);
        
      return finalObj
      }
    
    })

}

function updateVotes(req) {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  if( inc_votes === undefined || isNaN(inc_votes)){
    return Promise.reject({ status: 400, msg: "No votes provided" });
  } else
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2  RETURNING *;`,
      [inc_votes, article_id]
    )

    .then((result) => {
      if (result.rows.length === 0)
        return Promise.reject({ status: 404, msg: "Article not found" });
      else return result.rows;
    });
    
  }


  function getUsersArr(req) {
    return db
      .query("SELECT * FROM users")
      .then((result) => {
        if (result.rowCount === 0)
          return Promise.reject({ status: 404, msg: "user does not exist" });
        else return result.rows;
      })
      
  }


module.exports = { readTopics, readArticles, readArticlesID, readComments, 
  addComment, updateVotes, getUsersArr };